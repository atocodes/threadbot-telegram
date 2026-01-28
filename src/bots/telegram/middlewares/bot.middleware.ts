import { Context, MiddlewareFn} from "telegraf";
import { logger } from "../../../infrastructure/config";

export const errorMiddleware: MiddlewareFn<Context> = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // Proper error logging
    if (err instanceof Error) {
      logger.error({
        message: err.message,
        stack: err.stack,
        updateType: ctx.updateType,
        chatId: ctx.chat?.id,
        userId: ctx.from?.id,
      });
    } else {
      logger.error("Unknown middleware error :" + err);
    }

    // Safe user notification
    try {
      if (ctx.chat) {
        await ctx.reply("⚠️ Internal error occurred. Please try again later.");
      }
    } catch (replyError) {
      logger.warn("Failed to send error message" + replyError);
    }

    // IMPORTANT: rethrow so bot.catch() can handle it
    // throw err;
  }
};

