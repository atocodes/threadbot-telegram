import { Context, Markup } from "telegraf";
import { generateOllamaContent } from "../../../../../adapters/chat/ollama_ai";
import { pendingPosts } from "../../../state/pendingPosts.store";
import { Topic } from "../../../../../domain/entities";
// import { TopicNames } from "../../../types";

export async function CHANGE_POST(ctx: Context) {
  const userId = ctx.from!.id;
  const pending = pendingPosts.get(userId);

  if (!pending) {
    await ctx.answerCbQuery("No post to send.");
    return;
  }

  await ctx.editMessageText("✏️ Updating the post...");

  const newMsg = await generateOllamaContent({
    topic: pending.topic as Topic,
  });
  
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
