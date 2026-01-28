import { Context } from "telegraf";
import { CallbackQuery, Update } from "telegraf/types";
import { AssistantBotContext } from "../../types";
import { findTopicUseCase, logger } from "../../../../infrastructure";

export const SELECT_TOPIC_ACTION = async (
  ctx: Context<Update.CallbackQueryUpdate<CallbackQuery>> &
    Omit<AssistantBotContext, keyof Context<Update>> & {
      match: RegExpExecArray;
    },
) => {
  const threadId = parseInt(ctx.match[1]);
  const topic = await findTopicUseCase.execute({
    threadId,
  });
  if (topic == null) {
    logger.warn(
      { topic: topic },
      `Topic thread ${threadId} Not found in database, this might cause unexpected errors`,
    );
    return;
  }
  ctx.session.__scenes = { topic };
  await ctx.answerCbQuery();
  await ctx.editMessageText(
    `Great! You chose "${topic.title.toUpperCase()}".`,
  );
  ctx.scene.enter("promptScene");
};
