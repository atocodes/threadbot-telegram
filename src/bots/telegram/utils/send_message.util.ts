import { Markup } from "telegraf";
import { generateOllamaContent } from "../../../adapters";
import { pendingPosts } from "../state";
import { AssistantBotContext, NewPostParams } from "../types";
import { retry } from "./retry.util";

export async function SendMessage(
  ctx: AssistantBotContext,
  newPostArgs: NewPostParams,
) {
  ctx.reply(`🧠 Generating content for *${newPostArgs.topic.title}*...`, {
    parse_mode: "Markdown",
  });
  const res = await retry(() => generateOllamaContent(newPostArgs), {
    retries: 3,
    delayMs: 1500,
  });

  pendingPosts.set(ctx.from?.id!, {
    message: res!,
    topic: newPostArgs.topic,
  });

  await ctx.reply(res as string, {
    parse_mode: "HTML",
    ...Markup.inlineKeyboard([
      [
        Markup.button.callback("Post", "POST_CONTENT"),
        Markup.button.callback("change", "CHANGE_POST"),
      ],
      [Markup.button.callback("Cancel", "CANCEL_POST")],
    ]),
  });
}
