import { Context, Markup, TelegramError } from "telegraf";
import { getNextTopic } from "../../../utils/topic_rotation";
import { generateOllamaContent } from "../../../adapters/chat/ollama_ai";
import { logger } from "../../../config/logger";
import { generateGeminiContent } from "../../../adapters/chat/gemini_ai";
import { GoogleGenerativeAIError } from "@google/generative-ai";
import { pendingPosts } from "../../../store/session.store";
import { NewPostParams } from "../../../types/bot_types";

export async function createPostCommand(
    ctx: Context,
    newPostParams?: NewPostParams
) {
    try {
        const userId = ctx.from!.id;
        const nextTopic = newPostParams != null ? newPostParams.topic : getNextTopic();
        const msg =
            (await generateGeminiContent(nextTopic, newPostParams?.prompt)) ??
            (await generateOllamaContent(nextTopic ,newPostParams?.prompt));
console.log(newPostParams)
        pendingPosts.set(userId, {
            topic: nextTopic,
            message: msg!
        });

        await ctx.reply(msg as string, {
            parse_mode: "HTML",
            link_preview_options: {
                show_above_text: true,
                prefer_small_media: true
            },
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback("✅ Post", "POST_CONTENT"),
                    Markup.button.callback("🔄 Change", "CHANGE_POST")
                ],
                [Markup.button.callback("❌ Cancel", "CANCEL_POST")]
            ])
        });
    } catch (error) {
        if (error instanceof TelegramError) {
            await ctx.reply("❌ Error generating content. Try again.");
            return;
        }
        logger.error(error);
    }
}
