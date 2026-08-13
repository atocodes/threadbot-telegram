import { Markup, Scenes } from "telegraf";
import { AssistantBotContext } from "../types";
import { REMOVE_TOPIC_ACTION } from "./topic-management-actions";
import { topicRepository } from "../../../infrastructure";

export const manageTopicsScene = new Scenes.BaseScene<AssistantBotContext>(
  "manageTopicsScene",
);

manageTopicsScene.enter(async (ctx) => {
  const userTopics = await topicRepository.findMany({
    creatorId: ctx.from?.id,
  });

  if (userTopics.length == 0) {
    await ctx.reply("No topics registered under your administration.");
    return ctx.scene.leave();
  }

  await ctx.reply("Select a topic:\nType /cancel to abort topic management.", {
    ...Markup.inlineKeyboard(
      userTopics.map((topic) => [
        Markup.button.callback(`📌 ${topic.title}`, `topic:${topic.threadId}`),
        Markup.button.callback("🗑️", `remove:${topic.threadId}`),
      ]),
    ),
  });
});

manageTopicsScene.action(/^remove:(.+)/, REMOVE_TOPIC_ACTION);

export async function STARTMANAGETOPICCONVERSATION(ctx: AssistantBotContext) {
  ctx.scene.enter("manageTopicsScene");
}
