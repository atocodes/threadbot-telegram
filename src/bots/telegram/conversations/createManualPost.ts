import { Scenes, session, Markup, Context } from "telegraf";
import { AssistantBotContext } from "../contexts/supergroup.context";
import { convertTo2DArray, SendMessage } from "../utils";
import { TopicNames, topicNamesList } from "../types";
import { pendingPrompts } from "../state";

// Use generic Scenes.SceneContext for simple flows
const topicScene = new Scenes.BaseScene<AssistantBotContext>("topicScene");
const promptScene = new Scenes.BaseScene<AssistantBotContext>("promptScene");
// Enter handler
topicScene.enter((ctx) =>
  ctx.reply("Which topic are you interested in?", {
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
  await ctx.editMessageText(`Great! you chose "${topic.toUpperCase()}"`);
  ctx.scene.enter("promptScene");
});

promptScene.enter((ctx) => {
  ctx.reply("Now write your prompt");
});

promptScene.on("text", async (ctx) => {
  console.log(ctx.update)
  console.log("hello")
  const topic = ctx.session.__scenes?.topic as TopicNames;
  const prompt = ctx.message.text;
  console.log(prompt)
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
