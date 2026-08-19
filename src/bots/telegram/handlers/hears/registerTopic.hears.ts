import { Context } from "telegraf";
import { Message, Update } from "telegraf/types";
import {
  logger,
  topicRepository,
} from "../../../../infrastructure/index.js";
import { bot } from "../../bot.js";
import { TopicLimitExceededError } from "../../../../domain/index.js";

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
      const topicExists = await topicRepository.findTopic({
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

      await topicRepository.create({
        title: msg.reply_to_message.forum_topic_created.name,
        threadId: msg.message_thread_id!,
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
    await ctx.deleteMessage(ctx.message.message_id);
  } catch (error) {
    if (error instanceof TopicLimitExceededError) {
      logger.error({ ...error }, error.message);
      await bot.telegram.sendMessage(
        ctx.from.id,
        `${error.message}\nDeleting Topic....`,
      );
      await bot.telegram.deleteForumTopic(
        ctx.chat.id,
        ctx.message.message_thread_id!,
      );

      await bot.telegram.sendMessage(
        ctx.from.id,
        `Topic Removed from the super group`,
      );
      return;
    }
    logger.error({ ...(error as Error) }, "Error happended creating topic");
    await bot.telegram.sendMessage(
      ctx.from.id,
      `Something went wrong Error: ${error} `,
    );
  }
}
