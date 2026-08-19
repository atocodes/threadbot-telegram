import { Context } from "telegraf";
import { generatePostContent } from "../../../../../adapters/index.js";
import { retry } from "../../../utils/retry.util.js";
import { NewPostParams } from "../../../types/post.types.js";
import { pendingPosts, pendingPrompts } from "../../../state/index.js";
import { logger } from "../../../../../infrastructure/config/index.js";
import { postPreviewKeyboard } from "../../../utils/post_preview_keyboard.util.js";

export async function RETRY_PROMPT(ctx: Context) {
  try {
    await ctx.answerCbQuery();
    var data = pendingPrompts.get(ctx.from!.id!);
    if (!data) {
      return ctx.reply("Noting to retry");
    }

    const { topic } = data;

    await ctx.editMessageText(`Retrying *${topic}*...`, {
      parse_mode: "Markdown",
    });

    const res = await retry(
      () => generatePostContent(data as NewPostParams),
      {
        retries: 3,
        delayMs: 1500,
      }
    );

    pendingPosts.set(ctx.from?.id!, {
      topic,
      message: res,
      prompt: data.prompt,
    });

    await ctx.editMessageText(res as string, {
      parse_mode: "HTML",
      ...postPreviewKeyboard(),
    });
  } catch (error) {
    logger.error(error);
    await ctx.reply("Retry faild again. Try later")
  }
}
