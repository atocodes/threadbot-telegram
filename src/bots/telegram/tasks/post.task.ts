import { TelegramError } from "telegraf";
import { PendingPost } from "../types/post.types.js";
import {
  isPosting,
  lastPostedAt,
  updateIsPosting,
} from "../utils/anti_span_guards.js";
import { getNextTopic } from "../utils/topic_rotation.js";
import { bot } from "../bot.js";
import { generatePostContent } from "../../../adapters/index.js";
import { logger } from "../../../infrastructure/config/index.js";
import { MIN_INTERVAL } from "../../../constants/index.js";
import { SUPER_GROUP_ID } from "../../../infrastructure/config/env.config.js";
import { topicRepository } from "../../../infrastructure/index.js";

let retryCount = 0;

export async function postTask({ message, topic }: PendingPost) {
  if (isPosting) {
    logger.warn("Post skipped: already running");
    return;
  }

  const now = Date.now();

  if (now - lastPostedAt < MIN_INTERVAL) {
    logger.warn("Post skipped: too soon");
    return;
  }

  updateIsPosting(true);

  try {
    const targetTopic = topic ?? (await getNextTopic());
    logger.info("-----------------------");
    const msg =
      message ??
      (await generatePostContent({ topic: targetTopic }));

    if (!msg) return;

    await bot.telegram.sendMessage(SUPER_GROUP_ID, msg, {
      parse_mode: "HTML",
      message_thread_id: targetTopic.threadId,
      link_preview_options: {
        show_above_text: true,
        prefer_small_media: true,
        prefer_large_media: false,
      },
    });

    await topicRepository.updateTopic({
      threadId: targetTopic.threadId,
      title: targetTopic.title,
      lastPostedAt: new Date().toISOString(),
    });
    logger.info(
      {
        topic: targetTopic,
        SUPER_GROUP_ID,
      },
      "Scheduled message sent.",
    );
    logger.info("-----------------------");
  } catch (error) {
    logger.error({ error }, "Failed to send scheduled message.");
    if (error instanceof TelegramError) {
      await bot.telegram.sendMessage(
        SUPER_GROUP_ID,
        `⚠️ An error occurred while posting: ${error.description || error.message}`,
        { parse_mode: "HTML" },
      );
    }
  } finally {
    updateIsPosting(false);
    if (retryCount > 0) retryCount = 0;
  }
}
