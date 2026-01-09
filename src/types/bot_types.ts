import { TopicNames } from "../constants/topics";
import { Context, Scenes } from "telegraf";

export type PendingPost = {
  topic: TopicNames;
  message: string;
};

export interface BotSession extends Scenes.WizardSessionData {}
export interface BotContext extends Context {
  session: Scenes.WizardContext<BotSession>;
  scene: Scenes.SceneContext<BotContext>;
}
