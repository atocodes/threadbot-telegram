import { Scenes } from "telegraf";
import { AssistantBotContext } from "../types";
import {
  manageTopicsScene,
  STARTMANAGETOPICCONVERSATION,
} from "./manage-topics.conversations";
import {
  promptScene,
  STARTMANUALPOSTCONVERSATION,
  topicScene,
} from "./createManualPost";

const stage = new Scenes.Stage([topicScene, promptScene, manageTopicsScene]);

const endConversation = (ctx: AssistantBotContext) => {
  ctx.scene.leave();
  ctx.reply("Conversation cancelled.");
};

// Setup stage and session
stage.command("cancel", endConversation);

export { stage, STARTMANUALPOSTCONVERSATION, STARTMANAGETOPICCONVERSATION };
export * from "./topic-management-actions";
