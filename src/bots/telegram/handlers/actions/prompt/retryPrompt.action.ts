import { Context, Markup } from "telegraf";
import {
  generateOllamaContent,
} from "../../../../../adapters/chat/ollama_ai";
import { retry } from "../../../utils/retry.util";
import { NewPostParams } from "../../../types/post.types";
import { pendingPosts, pendingPrompts } from "../../../state";
import { logger } from "../../../../../infrastructure/config";

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
      () => generateOllamaContent(data as NewPostParams),
      {
        retries: 3,
        delayMs: 1500,
      }
    );

    pendingPosts.set(ctx.from?.id!, {
      topic,
      message: res,
    });

    await ctx.editMessageText(res as string, {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback("Post", "POST_CONTENT"),
          Markup.button.callback("Change", "CHANGE_POST"),
        ],
        [Markup.button.callback("Cancel", "CANCEL_POST")],
      ]),
    });
  } catch (error) {
    logger.error(error);
    await ctx.reply("Retry faild again. Try later")
  }
}
