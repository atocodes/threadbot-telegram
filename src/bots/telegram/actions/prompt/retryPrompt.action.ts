import { Context } from "telegraf";
import { pendingPrompts } from "../../../../store/session.store";
//import {} from "../../../adapters/chat";

export async function RETRY_PROMPT(ctx: Context) {
    var pendingPrompt = pendingPrompts.get(ctx.from!.id!);
}
