import { Scenes } from "telegraf";
import { pendingPosts } from "../state/index.js";
import { AssistantBotContext } from "../types/index.js";
import { postPreviewKeyboard } from "../utils/post_preview_keyboard.util.js";

export const editPostScene = new Scenes.BaseScene<AssistantBotContext>(
  "editPostScene",
);

editPostScene.on("text", async (ctx) => {
  const pending = pendingPosts.get(ctx.from.id);
  if (!pending) {
    await ctx.reply("The draft no longer exists. Create a new post to continue.");
    return ctx.scene.leave();
  }

  pending.message = ctx.message.text;
  pendingPosts.set(ctx.from.id, pending);

  await ctx.reply(pending.message, {
    parse_mode: "HTML",
    ...postPreviewKeyboard(),
  });
  await ctx.scene.leave();
});
