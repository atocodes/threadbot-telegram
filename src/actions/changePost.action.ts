import { Context, Markup } from "telegraf";
import { sendMessage } from "../services/ollama_ai";
import { pendingPosts } from "../types/bot_types";

export async function CHANGE_POST(ctx: Context) {
  const userId = ctx.from!.id;
  const pending = pendingPosts.get(userId);

  if (!pending) {
    await ctx.answerCbQuery("No post to send.");
    return;
  }

  const newMsg = await sendMessage(pending.topic);
  pending.message = newMsg!;
  pendingPosts.set(userId, pending);

  await ctx.editMessageText(newMsg!, {
    parse_mode: "HTML",
    link_preview_options: {
      show_above_text: true,
    },
    ...Markup.inlineKeyboard([
      [
        Markup.button.callback("✅ Post", "POST_CONTENT"),
        Markup.button.callback("🔄 Change", "CHANGE_POST"),
      ],
      [Markup.button.callback("❌ Cancel", "CANCEL_POST")],
    ]),
  });

  await ctx.answerCbQuery("Post updated 🔄");
}