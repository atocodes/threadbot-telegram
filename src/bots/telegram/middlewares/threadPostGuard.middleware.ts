import { Context, MiddlewareFn } from "telegraf";
import { publicTopicIds } from "../../../constants/index.js";
import { logger } from "../../../infrastructure/index.js";
import { isUserAdmin } from "../utils/index.js";
import { bot } from "../bot.js";

const escapeHtml = (text = "") =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const getUsername = (from: NonNullable<Context["from"]>) =>
  from.username ? `@${from.username}` : from.first_name;

export const threadPostGuard: MiddlewareFn<Context> = async (ctx, next) => {
  try {
    const msg = ctx.message;
    const chat = ctx.chat;
    const sender = ctx.from;

    if (!msg || !chat || !sender) return next();
    if (chat.type !== "supergroup") return next();

    const threadId = msg.message_thread_id;
    const isGeneralTopic = threadId === undefined;
    const isAdmin = await isUserAdmin(sender.id);
    const username = getUsername(sender);
    const messageText = "text" in msg ? msg.text : "";
    const escapedText = escapeHtml(messageText);

    /** ❌ Block bot commands in General */
    if (
      msg &&
      "entities" in msg &&
      msg.entities?.some((e) => e.type === "bot_command")
    ) {
      await ctx.deleteMessage();

      await bot.telegram.sendMessage(
        sender.id,
        `Hello ${username}, your message was deleted because <b>"it includes bot commands"</b>.\nBot commands are not allowed in this chat. Both admins and users must use commands in the bot’s private chat only.`,
        { parse_mode: "HTML" },
      );
      return;
    }

    /** ❌ Block non-admins from restricted topics */
    if (!isGeneralTopic && !publicTopicIds.includes(threadId) && !isAdmin) {
      await ctx.deleteMessage();

      await bot.telegram.sendMessage(
        sender.id,
        `Hello ${username}, your message was deleted.
You can only post in the "General" topic.

To resend it, copy your message below:
<code>${escapedText}</code>`,
        { parse_mode: "HTML" },
      );
      return;
    }

    return next();
  } catch (e) {
    logger.error({ e }, "ThreadPostGuard error");
  }
};
