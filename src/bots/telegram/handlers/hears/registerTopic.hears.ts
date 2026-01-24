import { Context } from "telegraf";
import { isUserAdmin } from "../../utils";
import {
  createTopicUseCase,
  findTopicUseCase,
} from "../../../../infrastructure/container";
import { logger } from "../../../../infrastructure/config";
import { Message, Update } from "telegraf/types";
import { bot } from "../../bot";

export async function registerTopic(
  ctx: Context<{
    message: Update.New & Update.NonChannel & Message.TextMessage;
    update_id: number;
  }>,
) {
  try {
    const msg = ctx.message;
    if (
      msg.is_topic_message &&
      ctx.updateType == "message" &&
      "reply_to_message" in msg! &&
      "forum_topic_created" in msg.reply_to_message!
    ) {
      const topicExists = await findTopicUseCase.execute({
        threadId: msg.message_thread_id,
      });

      if (topicExists) {
        logger.warn(
          `Topic "${topicExists.title} Already Exists ID:${topicExists.threadId}`,
        );
        await bot.telegram.sendMessage(
          ctx.from.id,
          `Topic <b>${topicExists.title}</b> already exists (<code>ID: ${topicExists.threadId}</code>).`,
          { parse_mode: "HTML" },
        );
        return;
      }

      createTopicUseCase.execute({
        title: msg.reply_to_message.forum_topic_created.name,
        threadId: msg.message_thread_id,
        creator: msg.from,
      });

      logger.info(
        {
          topic: msg.reply_to_message.forum_topic_created,
          thread_id: msg.message_thread_id,
        },
        `New Topic "${msg.reply_to_message.forum_topic_created.name}" created`,
      );

      await bot.telegram.sendMessage(
        ctx.from.id,
        `✅ New topic <b>${msg.reply_to_message.forum_topic_created.name}</b> Successfully created By <b>YOU</b>\n(ID: <code>${msg.message_thread_id}</code>)`,
        { parse_mode: "HTML" },
      );
    }
  } catch (error) {
    logger.error({ ...(error as Error) }, "Error happended creating topic");
    await bot.telegram.sendMessage(
      ctx.from.id,
      `Something went wrong Error: ${error} `,
    );
  } finally {
    ctx.deleteMessage(ctx.message.message_id);
  }
}
