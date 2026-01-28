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
import { logger } from "../../../infrastructure/config";
import { MIN_INTERVAL } from "../../../constants";
import { SUPER_GROUP_ID } from "../../../infrastructure/config/env.config";
import { updateTopicUsecase } from "../../../infrastructure";

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
    const nextTopicName = topic ?? (await getNextTopic());
    logger.info("-----------------------");
    const msg =
      message ??
      (await generateGeminiContent({ topic: nextTopicName })) ??
      (await generateOllamaContent({ topic: nextTopicName }));

    if (!msg) return;

    await bot.telegram.sendMessage(SUPER_GROUP_ID, msg, {
      parse_mode: "HTML",
      message_thread_id: topic?.threadId,
      link_preview_options: {
        show_above_text: true,
        prefer_small_media: true,
        prefer_large_media: false,
      },
    });

    await updateTopicUsecase.execute({
      threadId: topic?.threadId as number,
      title: topic?.title as string,
      lastPostedAt: new Date().toISOString(),
    });
    logger.info(
      {
        topic: nextTopicName,
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
