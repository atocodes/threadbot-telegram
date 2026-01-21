import { Scenes } from "telegraf";

interface AssistantBotSession extends Scenes.SceneSessionData {
  topic?: string;
  question?: string;
  lastResponseMessageId?: number;
}

export interface AssistantBotContext extends Scenes.SceneContext<AssistantBotSession> {}
