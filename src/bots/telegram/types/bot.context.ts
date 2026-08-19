import { Scenes } from "telegraf";
import { Topic } from "../../../domain/entities/index.js";

interface AssistantBotSession extends Scenes.SceneSessionData {
  topic?: Topic;
  question?: string;
  lastResponseMessageId?: number;
}

export interface AssistantBotContext extends Scenes.SceneContext<AssistantBotSession> {}
