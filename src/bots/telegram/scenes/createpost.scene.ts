import { Scenes } from "telegraf";

export interface NewPostState {
  prompt?: string;
  topic?: string;
  cursor: number;
}

export const createPost = new Scenes.WizardScene<
  Scenes.WizardContext<NewPostState>
>(
  "CHOOSE_TOPIC",
  async (ctx) => {
    await ctx.reply("Choose topic");
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (!ctx.message || !("text" in ctx.message)) {
      await ctx.reply("Please send text only");
      return;
    }
    (ctx.wizard.state as NewPostState).topic = ctx.message.text;
    await ctx.reply("write your prompt");
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (!ctx.message || !("text" in ctx.message)) {
      await ctx.reply("Please send a prompt");
      return;
    }

    (ctx.wizard.state as NewPostState).prompt = ctx.message.text;
    const newPost = ctx.wizard.state as NewPostState;
    await ctx.reply(`Got Topic: ${newPost.topic}\n Prompt: ${newPost.prompt}`);
    return ctx.scene.leave();
  }
);


