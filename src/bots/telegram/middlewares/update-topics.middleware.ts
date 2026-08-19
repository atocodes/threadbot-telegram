import { Context } from "telegraf";
import { Update } from "telegraf/types";
import { topicRepository } from "../../../infrastructure/index.js";

export const updateTopic = async (ctx: Context<Update.MessageUpdate>) => {
  const msg = ctx.message;

  if ("forum_topic_edited" in msg && msg.is_topic_message) {
    const threadId = msg.message_thread_id;
    const title = msg.forum_topic_edited.name;

    if (threadId && title)
      await topicRepository.updateTopic({
        threadId,
        title,
      });

    return;
  }
};
