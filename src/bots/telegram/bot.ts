import { Telegraf, TelegramError, Markup } from "telegraf";
import { schedule } from "node-cron";
import { logger } from "../../config/logger";
import { BOTOKEN } from "../../config/env";
import { TopicIds, TopicNames, topicNamesList } from "../../constants/topics";
import { MIN_INTERVAL } from "../../constants/post";
import { getNextTopic } from "../../utils/topic_rotation";
import {
    isPosting,
    lastPostedAt,
    updateIsPosting
} from "../../utils/anti_span_guards";
import { actions } from "./actions";
import { adapters } from "../../adapters";
import { BotContext, NewPostParams, PendingPost } from "../../types/bot_types";
import { createPostCommand } from "./commands/createPost.command";
import { generateOllamaContent } from "../../adapters/chat/ollama_ai";
import { pendingPosts, pendingPrompts } from "../../store/session.store";
import { errorMiddleware } from "./middlewares/bot.middleware";

if (!BOTOKEN) throw new Error("BOTOKEN not set in .env");

export const bot = new Telegraf<BotContext>(BOTOKEN!);
bot.catch(async (err, ctx) => {
    console.log(err);
    ctx.reply("err happened ")
});
const supergroupId = -1003628334767;
let retryCount = 0;
bot.use(errorMiddleware);

export async function postTask({ message, topic }: PendingPost) {
    if (isPosting) {
        logger.warn("Post skipped: already running");
        return;
    }

    const now = Date.now();
    if (now - lastPostedAt < MIN_INTERVAL) {
        logger.warn("Post skipped: too soon");
        return;
    }

    updateIsPosting(true);

    try {
        const nextTopicName = topic ?? getNextTopic();
        console.log(nextTopicName);
        logger.info("Sending message");
        logger.info("TOPIC: " + nextTopicName);
        logger.info("Supergroup ID: " + supergroupId);
        logger.info("Topic ID: " + nextTopicName);
        logger.info("Topic Link: " + TopicIds[nextTopicName]);
        const msg =
            message ??
            (await adapters.generateGeminiContent({ topic: nextTopicName })) ??
            (await adapters.generateOllamaContent({ topic: nextTopicName }));
        if (!msg) return;
        await bot.telegram.sendMessage(supergroupId, msg, {
            parse_mode: "HTML",
            message_thread_id: TopicIds[nextTopicName],
            link_preview_options: {
                show_above_text: true,
                prefer_small_media: true,
                prefer_large_media: false
            }
        });

        logger.info("Scheduled message sent.");
    } catch (error) {
        if (error instanceof TelegramError) {
            logger.error(`Telegram Error: ${error.message}`);
            // return;
            retryCount += 1;
            if (retryCount != 3) {
                updateIsPosting(false);
                // console.log("Trying again", retryCount);
                return await postTask({ topic, message });
            }
            return;
        } else {
            logger.error("PostTask Error: " + error);
        }
    } finally {
        updateIsPosting(false);
        if (retryCount > 0) retryCount = 0;
    }

    // console.log(retryCount, isPosting);
}

schedule("*/15 * * * *", async () => {
    try {
        await postTask({});
    } catch (error) {
        logger.fatal("Cron crashed: " + (error as Error).message);
    }
});

bot.command("createpost", ctx => {
    ctx.reply("Select topic:", Markup.keyboard([...topicNamesList]).oneTime());
});

const isUserAdmin = async (ctx: BotContext) => {
    const userid = await ctx.message!.from.id;
    const admins = await ctx.telegram.getChatAdministrators(supergroupId);

    return admins.filter(user => user.user.id == userid).length > 0;
};

bot.hears(/^topic:/i, async ctx => {
    try {
        const text = ctx.message.text;
        if ((await isUserAdmin(ctx)) == false) {
            return ctx.reply("sorry youre not an admin");
        }
        const parts = Object.fromEntries(
            text.split("|").map(p => {
                const [key, ...rest] = p.split(":");
                return [key.trim().toLowerCase(), rest.join(":").trim()];
            })
        );

        const topic = parts.topic as TopicNames;
        const prompt = parts.prompt;

        if (!topic || !prompt) {
            return ctx.reply(
                "❌ Format:\n topic:<name> | prompt:<instruction>"
            );
        }
        console.log(parts);
        pendingPrompts.set(ctx.from.id, parts as NewPostParams);
       console.log (pendingPrompts)

        ctx.reply(`🧠 Generating content for *${topic}*...`, {
            parse_mode: "Markdown"
        });

        const res = await generateOllamaContent({
            topic: topic as TopicNames,
            prompt
        });
        
        pendingPosts.set(ctx.from.id, {
            message: res!,
            topic: topic as TopicNames
        });

        await ctx.reply(res as string, {
            parse_mode: "HTML",
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback("Post", "POST_CONTENT"),
                    Markup.button.callback("change", "CHANGE_POST")
                ],
                [Markup.button.callback("Cancel", "CANCEL_POST")]
            ])
        });
    } catch (error) {
        if (error instanceof Error) {
            const msg: string = `Failed to generate or send post\nMsg: ${error.message} Err: ${error.name}\nuser: ${ctx.from?.id},
        `;
            logger.error(msg);
            await ctx.reply(msg, {
                ...Markup.inlineKeyboard([
                    [
                        Markup.button.callback("Retry", "RETRY_PROMPT"),
                        Markup.button.callback("Cancel", "CACNCLE_PROMPT")
                    ]
                ])
            });

            return;
        }

        logger.error("unkown error");
        await ctx.reply("Unknown error");
    }
});

Object.entries(actions).forEach(([key, handler]) => {
    bot.action(key, handler);
});
