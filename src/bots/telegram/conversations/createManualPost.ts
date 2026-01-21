import { Scenes, Markup } from "telegraf";
import { convertTo2DArray, SendMessage } from "../utils";
import { AssistantBotContext, TopicNames, topicNamesList } from "../types";
import { pendingPrompts } from "../state";

// Use generic Scenes.SceneContext for simple flows
const topicScene = new Scenes.BaseScene<AssistantBotContext>("topicScene");
const promptScene = new Scenes.BaseScene<AssistantBotContext>("promptScene");
// Enter handler
topicScene.enter((ctx) =>
  ctx.reply("Choose a topic:", {
    ...Markup.inlineKeyboard(
      convertTo2DArray(topicNamesList.map((topic) => `${topic}`)).map(
        (topicRow) => {
          return topicRow.map((topic) =>
            Markup.button.callback(topic, `topic:${topic}`),
          );
        },
      ),
    ),
  }),
);

// Inline button handlers
topicScene.action(/^topic:(.+)/, async (ctx) => {
  const topic = ctx.match[1];
  ctx.session.__scenes = { topic };
  await ctx.answerCbQuery();
  await ctx.editMessageText(`Great! You chose "${topic.toUpperCase()}".`);
  ctx.scene.enter("promptScene");
});

promptScene.enter((ctx) => {
  ctx.reply("Alright! What would you like the content to say? ✨");
});

promptScene.on("text", async (ctx) => {
  const topic = ctx.session.__scenes?.topic as TopicNames;
  const prompt = ctx.message.text;
  pendingPrompts.set(ctx.from.id, { topic, prompt });

  await SendMessage(ctx, { topic, prompt });
  pendingPrompts.delete(ctx.from.id);
  ctx.scene.leave();
});
// Setup stage and session
export const stage = new Scenes.Stage([topicScene, promptScene]);

export async function STARTMANUALPOSTCONVERSATION(ctx: AssistantBotContext) {
  ctx.scene.enter("topicScene");
}
