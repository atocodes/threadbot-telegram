import { Context } from "telegraf";
import { generatePostContent } from "../../../../../adapters/index.js";
import { pendingPosts } from "../../../state/pendingPosts.store.js";
import { Topic } from "../../../../../domain/entities/index.js";
import { logger } from "../../../../../infrastructure/config/index.js";
import { postPreviewKeyboard } from "../../../utils/post_preview_keyboard.util.js";

export async function REGENERATE_POST(ctx: Context) {
  const userId = ctx.from!.id;
  const pending = pendingPosts.get(userId);

  if (!pending) {
    await ctx.answerCbQuery("No post to send.");
    return;
  }

  await ctx.answerCbQuery("Regenerating post...");
  await ctx.editMessageText("🔄 Regenerating the post...");

  try {
    const newMsg = await generatePostContent({
      topic: pending.topic as Topic,
      prompt: pending.prompt,
    });
    if (!newMsg) throw new Error("No content was generated.");

    pending.message = newMsg;
    pendingPosts.set(userId, pending);

    await ctx.editMessageText(newMsg, {
      parse_mode: "HTML",
      link_preview_options: { show_above_text: true },
      ...postPreviewKeyboard(),
    });
  } catch (error) {
    logger.error({ error }, "Failed to regenerate post content.");
    await ctx.editMessageText("Unable to regenerate the post. Please try again.");
  }
}
