import { Context, Markup, TelegramError } from "telegraf";
import { getNextTopic } from "../utils/topic_rotation";
import { sendMessage } from "../services/ollama_ai";
import { logger } from "../config/logger";
import { pendingPosts } from "../types/bot_types";

export async function createPostCommand(ctx: Context) {
  try {
    const userId = ctx.from!.id;
    const nextTopic = getNextTopic();
    const msg = await sendMessage(nextTopic);
   
    pendingPosts.set(userId, {
      topic: nextTopic,
      message: msg!,
    });

    await ctx.reply(msg as string, {
      parse_mode: "HTML",
      link_preview_options: {
        show_above_text: true,
        prefer_small_media: true,
      },
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback("✅ Post", "POST_CONTENT"),
          Markup.button.callback("🔄 Change", "CHANGE_POST"),
        ],
        [Markup.button.callback("❌ Cancel", "CANCEL_POST")],
      ]),
    });
  } catch (error) {
    if (error instanceof TelegramError) {
      await ctx.reply("❌ Error generating content. Try again.");
      return;
    }
    logger.error(error);
  }
}
