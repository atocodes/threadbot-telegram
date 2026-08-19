import { Context } from "telegraf";
import { CallbackQuery, Update } from "telegraf/types";
import { AssistantBotContext } from "../../types/index.js";
import { logger, topicRepository } from "../../../../infrastructure/index.js";
import { SUPER_GROUP_ID } from "../../../../infrastructure/config/env.config.js";
import { bot } from "../../bot.js";

export const REMOVE_TOPIC_ACTION = async (
  ctx: Context<Update.CallbackQueryUpdate<CallbackQuery>> &
    Omit<AssistantBotContext, keyof Context<Update>> & {
      match: RegExpExecArray;
    },
) => {
  await ctx.answerCbQuery();
  const threadId = parseInt(ctx.match[1]);
  await topicRepository.removeTopicAdmin({ threadId });
  // await bot.telegram.deleteForumTopic(SUPER_GROUP_ID, threadId);
  await ctx.editMessageText("Topic removed successfully.");
  await ctx.answerCbQuery();
  logger.info(`Topic ID: ${threadId} Removed Successfully`);
  await ctx.scene.reenter();
};
