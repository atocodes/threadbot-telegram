import { Telegraf, TelegramError } from "telegraf";
import { schedule } from "node-cron";
import { logger } from "../config/logger";
import { generateGeminiAnswer, generateGeminiContent } from "./gemini_ai";
import {
  // generateGeminiAnswer,
  generateOllamaContent,
} from "./ollama_ai";
import { BOTOKEN } from "../config/env";
import { InlineQueryResultArticle } from "telegraf/types";
import { TopicIds, TopicNames } from "../constants/topics";
import { MIN_INTERVAL } from "../constants/post";
import { getNextTopic } from "../utils/topic_rotation";
import {
  isPosting,
  lastPostedAt,
  updateIsPosting,
} from "../utils/anti_span_guards";
import { commands } from "../commands";
import { actions } from "../actions";

if (!BOTOKEN) throw new Error("BOTOKEN not set in .env");

export const bot = new Telegraf(BOTOKEN!);
const supergroupId = -1003628334767;

export async function postTask(content?: string, topic?: TopicNames) {
  const now = Date.now();

  if (isPosting) {
    logger.warn("Post skipped: already running");
    return;
  }

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

    const msg =
      content ??
      (await generateGeminiContent(nextTopicName)) ??
      (await generateOllamaContent(nextTopicName));
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
      return;
    } else {
      console.error(error);
    }
  } finally {
    updateIsPosting(false);
  }
}

schedule("*/30 */6 * * *", () => postTask());

bot.command("createpost", commands.createPost);

Object.entries(actions).forEach(([key, handler]) => {
  bot.action(key, handler);
});

bot.on("inline_query", async (ctx) => {
  try {
    const query = ctx.inlineQuery.query.trim().toLowerCase();
    const results: InlineQueryResultArticle[] = [];
    setTimeout(() => {}, 2000);
    if (query != "" || !query) {
      const res = await generateGeminiAnswer(query);
      results.push(res!);
    }

    await ctx.answerInlineQuery(results, {
      cache_time: 3,
      is_personal: true,
    });
  } catch (error) {
    logger.error(error);
  }
});
