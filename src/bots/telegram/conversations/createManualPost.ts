import { Markup, Scenes } from "telegraf";
import { AssistantBotContext } from "../types";
import { findManyTopicUsecase, logger } from "../../../infrastructure";
import { convertTo2DArray, SendMessage } from "../utils";
import { pendingPrompts } from "../state";
import { SELECT_TOPIC_ACTION } from "./topic-management-actions/select-topic.action";

// Use generic Scenes.SceneContext for simple flows
export const topicScene = new Scenes.BaseScene<AssistantBotContext>(
  "topicScene",
);
export const promptScene = new Scenes.BaseScene<AssistantBotContext>(
  "promptScene",
);
// Enter handler
topicScene.enter(async (ctx) => {
  const topics =
    (await findManyTopicUsecase.execute({
      "creator.id": ctx.from?.id,
    })) ?? [];

  if (topics.length === 0) {
    await ctx.reply("No topics registered under your administration.");
    return ctx.scene.leave();
  }
  await ctx.reply(
    "Choose a topic:\nYou can type /cancel at any time to stop the conversation.",
    {
      ...Markup.inlineKeyboard(
        convertTo2DArray(topics).map((row) =>
          row.map((topic) =>
            Markup.button.callback(topic.title, `topic:${topic.threadId}`),
          ),
        ),
      ),
    },
  );
});

// Inline button handlers
topicScene.action(/^topic:(.+)/, SELECT_TOPIC_ACTION);

promptScene.enter((ctx) => {
  ctx.reply("Alright! What would you like the content to say? ✨");
});

promptScene.on("text", async (ctx) => {
  const topic = ctx.session.__scenes?.topic;
  const prompt = ctx.message.text;
  if (topic == undefined) {
    logger.error("Topic not found from cache");
    return;
  }
  pendingPrompts.set(ctx.from.id, { topic, prompt });

  await SendMessage(ctx, { topic, prompt });
  pendingPrompts.delete(ctx.from.id);
  ctx.scene.leave();
});

export async function STARTMANUALPOSTCONVERSATION(ctx: AssistantBotContext) {
  ctx.scene.enter("topicScene");
}
