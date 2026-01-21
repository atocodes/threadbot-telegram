import { Markup } from "telegraf";
import { generateOllamaContent } from "../../../../adapters";
import { parseTopicMessage } from "../../parsers/topicMessage.parser";
import { pendingPrompts } from "../../state";
import { NewPostParams } from "../../types/post.types";
import { logger } from "../../../../infrastructure/config";
import { SendMessage } from "../../utils";

export const topicHearsHandler = async (ctx: any) => {
  try {
    const text = ctx.message.text;

    const parts = parseTopicMessage(text);

    pendingPrompts.set(ctx.from.id, parts as NewPostParams);

    await SendMessage(ctx, parts);
  } catch (error) {
    if (error instanceof Error) {
      const msg: string = `Failed to generate or send post\nMsg: ${error.message} Err: ${error.name}\nuser: ${ctx.from?.id},
        `;
      logger.error(msg);
      await ctx.reply(msg, {
        ...Markup.inlineKeyboard([
          [
            Markup.button.callback("Retry", "RETRY_PROMPT"),
            Markup.button.callback("Cancel", "CACNCLE_PROMPT"),
          ],
        ]),
      });

      return;
    }

    logger.error("unkown error");
    await ctx.reply("Unknown error");
  }
};
