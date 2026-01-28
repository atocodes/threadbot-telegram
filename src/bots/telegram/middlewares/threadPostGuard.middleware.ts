import { Context, MiddlewareFn } from "telegraf";
import { publicTopicIds } from "../../../constants";
import { findTopicUseCase, getTopicsUseCase } from "../../../infrastructure";
import { isUserAdmin } from "../utils";

export const threadPostGuard: MiddlewareFn<Context> = async (
  ctx: Context,
  next: () => Promise<void>,
) => {
  try {
    const msg = ctx.message;
    const chat = ctx.chat;
    const sender = ctx.from;
    const threadId = msg?.message_thread_id;
    const isTopicGeneral = threadId == undefined;
    if (sender?.id == undefined) return;
    const isAdmin = await isUserAdmin(sender?.id!);

    if (
      ["message", "command"].includes(ctx.updateType) &&
      chat &&
      chat?.type == "supergroup" &&
      !publicTopicIds.includes(threadId) &&
      msg?.message_thread_id != undefined &&
      sender &&
      isTopicGeneral == false &&
      isAdmin == false
    ) {
      return ctx.deleteMessage(msg.message_id);
    }
  } catch (e) {
    console.log(e, "ERRRRRRRRRR");
    return;
  } finally {
    await next();
  }
};
