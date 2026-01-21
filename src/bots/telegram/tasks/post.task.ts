import { TelegramError } from "telegraf";
import { PendingPost } from "../types/post.types";
import {
  isPosting,
  lastPostedAt,
  updateIsPosting,
} from "../utils/anti_span_guards";
import { getNextTopic } from "../utils/topic_rotation";
import { bot } from "../bot";
import {
  generateGeminiContent,
  generateOllamaContent,
} from "../../../adapters";
import { TopicIds } from "../types";
import { logger } from "../../../infrastructure/config";
import { MIN_INTERVAL } from "../../../constants";

const supergroupId = -1003628334767;
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
    const nextTopicName = topic ?? getNextTopic();
    logger.info("Sending message");
    logger.info("TOPIC: " + nextTopicName);
    logger.info("Supergroup ID: " + supergroupId);
    logger.info("Topic ID: " + nextTopicName);
    logger.info("Topic Link: " + TopicIds[nextTopicName]);
    const msg =
      message ??
      (await generateGeminiContent({ topic: nextTopicName })) ??
      (await generateOllamaContent({ topic: nextTopicName }));

    if (!msg) return;
  
    await bot.telegram.sendMessage(supergroupId, msg, {
      parse_mode: "HTML",
      message_thread_id: TopicIds[nextTopicName],
      link_preview_options: {
        show_above_text: true,
        prefer_small_media: true,
        prefer_large_media: false,
      },
    });

    logger.info("Scheduled message sent.");
  } catch (error) {
    if (error instanceof TelegramError) {
      logger.error(`Telegram Error: ${error.message}`);
      // return;
      retryCount += 1;
      if (retryCount != 3) {
        updateIsPosting(false);
        return await postTask({ topic, message });
      }
      return;
    } else {
      logger.error("PostTask Error: " + error);
    }
  } finally {
    updateIsPosting(false);
    if (retryCount > 0) retryCount = 0;
  }
}
