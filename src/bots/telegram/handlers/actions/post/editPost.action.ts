import { pendingPosts } from "../../../state/pendingPosts.store.js";
import { AssistantBotContext } from "../../../types/index.js";

export async function EDIT_POST(ctx: AssistantBotContext) {
  const pending = pendingPosts.get(ctx.from!.id);
  if (!pending) {
    await ctx.answerCbQuery("No post to edit.");
    return;
  }

  await ctx.answerCbQuery();
  await ctx.editMessageText("✏️ Send the complete replacement text for this post.");
  await ctx.scene.enter("editPostScene");
}
