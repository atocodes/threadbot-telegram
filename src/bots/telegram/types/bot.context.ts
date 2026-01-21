import { Scenes } from "telegraf";

interface AssistantBotSession extends Scenes.SceneSessionData {
  topic?: string;
  question?: string;
}

export interface AssistantBotContext extends Scenes.SceneContext<AssistantBotSession>{}

