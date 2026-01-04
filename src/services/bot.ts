import { Telegraf, TelegramError } from "telegraf";
import { message } from "telegraf/filters";
import { schedule } from "node-cron";
// import { sendMsg } from "./gemini_ai";
import { logger } from "../config/logger";
import { sendMsg } from "./gemini_ai";
import { answerQuestion, sendMessage } from "./ollama_ai";
import { BOTOKEN } from "../config/env";
import {
  Chat,
  InlineQueryResultArticle,
  InputTextMessageContent,
} from "telegraf/types";
import { TopicIds, TopicNames } from "../constants/topics";
import { MIN_INTERVAL } from "../constants/post";
import { getNextTopic } from "../utils/topic_rotation";
import {
  isPosting,
  lastPostedAt,
  updateIsPosting,
} from "../utils/anti_span_guards";

if (!BOTOKEN) throw new Error("BOTOKEN not set in .env");

export const bot = new Telegraf(BOTOKEN!);
const supergroupId = -1003628334767;

async function postTask() {
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
    const nextTopicName = getNextTopic();

    console.log(nextTopicName);
    logger.info("Sending message");
    console.log("TOPIC: ", nextTopicName);
    console.log("Supergroup ID:", supergroupId);
    console.log("Topic ID:", nextTopicName);

    const msg = await sendMessage(nextTopicName);
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
    } else {
      console.error(error);
    }
  } finally {
    updateIsPosting(false);
  }
}

schedule("*/30 */6 * * *", postTask);

bot.on("inline_query", async (ctx) => {
  try {
    const query = ctx.inlineQuery.query.trim().toLowerCase();
    const results: InlineQueryResultArticle[] = [];
    console.log(query);
    if (query != "" || !query) {
      const res = await answerQuestion(query);
      results.push(res!);
    }

    await ctx.answerInlineQuery(results, { cache_time: 3, is_personal: true });
  } catch (error) {
    logger.error(error);
  }
});

// bot.on("inline_query", async (ctx) => {
//   console.log("MSG RECIVED")
//   const query = ctx.inlineQuery.query.trim().toLocaleLowerCase();
//   console.log("Inline query", query);
//   const results: InlineQueryResultArticle[] = [];
//   Object.values(TopicNames).forEach((topicName, index) => {
//     if (!query || topicName.includes(query)) {
//       results.push({
//         type: "article",
//         id: String(index + 1),
//         title: `Send message to topic: ${topicName}`,
//         input_message_content: {
//           message_text: `Hello! posting to topic: ${topicName}`,
//         },
//         description: `Topic ID: ${TopicIds[topicName as TopicNames]}`,
//       });
//     }
//   });

//   await ctx.answerInlineQuery(results, {
//     cache_time: 0, // 0 = no caching, useful during testing
//     is_personal: true, // result are personalized

//   },);
// });

// bot.on("message", async (ctx) => console.log(ctx.message));
