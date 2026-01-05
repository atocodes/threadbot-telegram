import { Context, Markup } from "telegraf";
import { pendingPosts } from "../types/bot_types";
import { postTask } from "../services/bot";
import { sendMessage } from "../services/ollama_ai";

export async function POST_CONTENT(ctx: Context) {
  const userId = ctx.from!.id;
  const pending = pendingPosts.get(userId);

  if (!pending) {
    await ctx.answerCbQuery("No post to send.");
    return;
  }

  await postTask();

  pendingPosts.delete(userId);

  await ctx.answerCbQuery("Posted successfully!!");
}
