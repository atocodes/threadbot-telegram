import { Context, Telegram } from "telegraf";
import {
  ALLOWED_SUPER_GROUP_IDS,
  logger,
} from "../../../infrastructure/config";
import { SUPER_GROUP_ID } from "../../../infrastructure/config/env.config";
import { isUserAdmin } from "../utils";

export const auth = async (
  ctx: Context,
  next: () => Promise<void>,
  telegram: Telegram,
) => {
  try {
    if (!ctx.chat || !ctx.from) return;
    const userId = await ctx.from?.id;
    const chatId = await ctx.chat?.id;
    const groupAdmins = await telegram.getChatAdministrators(SUPER_GROUP_ID);
    const isAdmin = await isUserAdmin(userId);

    if (
      (ctx.from && isAdmin) ||
      (ctx.chat && ALLOWED_SUPER_GROUP_IDS.includes(chatId))
    ) {
      await next();
    } else {
      logger.warn(
        {
          userName: ctx.from.username,
          userId: ctx.from.id,
          chatId: ctx.chat.id,
          time: new Date().toLocaleTimeString(),
          message: ctx.message,
        },
        `Unauthorozed user or group tried to access bot`,
      );
      return;
    }
  } catch (error) {}
};
