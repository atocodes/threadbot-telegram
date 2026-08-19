import { Scenes } from "telegraf";
import { AssistantBotContext } from "../types/index.js";
import {
  manageTopicsScene,
  STARTMANAGETOPICCONVERSATION,
} from "./manage-topics.conversations.js";
import {
  promptScene,
  STARTMANUALPOSTCONVERSATION,
  topicScene,
} from "./createManualPost.js";
import { editPostScene } from "./editPost.conversation.js";

const stage = new Scenes.Stage([
  topicScene,
  promptScene,
  editPostScene,
  manageTopicsScene,
]);

const endConversation = (ctx: AssistantBotContext) => {
  ctx.scene.leave();
  ctx.reply("Conversation cancelled.");
};

// Setup stage and session
stage.command("cancel", endConversation);

export { stage, STARTMANUALPOSTCONVERSATION, STARTMANAGETOPICCONVERSATION };
export * from "./topic-management-actions/index.js";
