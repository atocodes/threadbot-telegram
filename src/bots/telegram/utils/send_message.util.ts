import { generatePostContent } from "../../../adapters/index.js";
import { pendingPosts } from "../state/index.js";
import { AssistantBotContext, NewPostParams } from "../types/index.js";
import { retry } from "./retry.util.js";
import { postPreviewKeyboard } from "./post_preview_keyboard.util.js";

export async function SendMessage(
  ctx: AssistantBotContext,
  newPostArgs: NewPostParams,
) {
  ctx.reply(`🧠 Generating content for *${newPostArgs.topic.title}*...`, {
    parse_mode: "Markdown",
  });
  const res = await retry(() => generatePostContent(newPostArgs), {
    retries: 3,
    delayMs: 1500,
  });

  pendingPosts.set(ctx.from?.id!, {
    message: res!,
    topic: newPostArgs.topic,
    prompt: newPostArgs.prompt,
  });

  await ctx.reply(res as string, {
    parse_mode: "HTML",
    ...postPreviewKeyboard(),
  });
}
