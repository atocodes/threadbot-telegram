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
import { BotContext } from "../../types/bot_types";
import { createPostCommand } from "./commands/createPost.command";

if (!BOTOKEN) throw new Error("BOTOKEN not set in .env");

export const bot = new Telegraf<BotContext>(BOTOKEN!);
const supergroupId = -1003628334767;
let retryCount = 0;

export async function postTask(content?: string, topic?: TopicNames) {
    const now = Date.now();

    if (isPosting) {
        logger.warn("Post skipped: already running");
        return;
    }

    if (now - lastPostedAt < MIN_INTERVAL) {
        logger.warn("Post skipped: too soon");
        return;
    }

    updateIsPosting(true);

    try {
        const nextTopicName = topic ?? getNextTopic();

        logger.info("Sending message");
        logger.info("TOPIC: " + nextTopicName);
        logger.info("Supergroup ID: " + supergroupId);
        logger.info("Topic ID: " + nextTopicName);

        const msg =
            content ??
            (await adapters.generateGeminiContent(nextTopicName)) ??
            (await adapters.generateOllamaContent(nextTopicName));
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
                console.log("Trying again", retryCount);
                return await postTask();
            }
            return;
        } else {
            logger.error(error);
        }
    } finally {
        updateIsPosting(false);
        if (retryCount > 0) retryCount = 0;
    }

    console.log(retryCount, isPosting);
}

schedule("*/15 * * * *", () => postTask());

Object.entries(actions).forEach(([key, handler]) => {
    bot.action(key, handler);
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

    const topic = parts.topic;
    const prompt = parts.prompt;

    if (!topic || !prompt) {
        return ctx.reply("❌ Format:\n topic:<name> | prompt:<instruction>");
    }
    
    ctx.reply(`🧠 Generating content for *${topic}*...`, {
        parse_mode: "Markdown"
    });

    await createPostCommand(ctx, {
        topic: topic as TopicNames,
        prompt: prompt
    });
});

// bot.message("text",ctx=>{
//   const msg = ctx.message.text
//   console.log(`hey ${msg}...`)
// })
