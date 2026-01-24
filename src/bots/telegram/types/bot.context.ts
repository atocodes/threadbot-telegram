import { Scenes } from "telegraf";
import { Topic } from "../../../domain/entities";

interface AssistantBotSession extends Scenes.SceneSessionData {
  topic?: Topic;
  question?: string;
  lastResponseMessageId?: number;
}

export interface AssistantBotContext extends Scenes.SceneContext<AssistantBotSession> {}
