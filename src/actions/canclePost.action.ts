import { Context } from "telegraf";
import { pendingPosts } from "../types/bot_types";

export async function CANCEL_POST(ctx: Context) {
  const userId = ctx.from!.id;

  pendingPosts.delete(userId);

  await ctx.answerCbQuery("Cancelled ❌");
}