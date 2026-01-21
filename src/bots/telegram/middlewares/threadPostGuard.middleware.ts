import { Context, MiddlewareFn } from "telegraf";
import { getAdminsId } from "../utils/getAdminsId.util";

export const threadPostGuard: MiddlewareFn<Context> = async (
    ctx: Context,
    next: () => Promise<void>
) => {
    try{
const msg = ctx.message;
    const chat = ctx.chat;
    const admins = await getAdminsId();
    const senderId = ctx.from?.id;

    if (
        ["message", "command"].includes(ctx.updateType) &&
        chat &&
        chat?.type == "supergroup" &&
        msg?.message_thread_id != undefined &&
        senderId &&
        admins.includes(senderId) == false
    ) {
        ctx.deleteMessage(msg.message_id);
        return;
    }
    await next();
    }catch(e){
      console.log("error happened ::::::")
      return
    }
};
