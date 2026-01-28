import fs from "fs";
import { Context, Markup } from "telegraf";
import { logFilePath } from "../../../../../constants";
import { logger } from "../../../../../infrastructure/config";
import { findManyTopicUsecase } from "../../../../../infrastructure";
import { convertTo2DArray } from "../../../utils";

export async function GET_LOG(ctx: Context) {
  try {
    // Read file
    const raw = fs.readFileSync(logFilePath, { encoding: "utf-8" });

    // Format each line in Markdown style
    const formatted = raw
      .split("\n")
      .map((line) => {
        try {
          const log = JSON.parse(line);
          const level =
            log.level == 30 ? "INFO" : log.level == 40 ? "WARN" : "LOG";
          const time = new Date(log.time).toLocaleString();
          // Escape the | as well
          return `${level} | ${time} | ${log.msg}`;
        } catch {
          return `${line}`;
        }
      })
      .join("\n");

    const captionText =
      "Latest logs. The option and file will auto-delete in 5 seconds. Make sure you download it quickly.";
    const previewText = formatted
      .split("\n")
      .slice(0, 20)
      .map((line) => line)
      .join("\n");

    const sentMessage = await ctx.replyWithDocument(
      {
        source: logFilePath,
        filename: "App Logs.txt",
      },
      {
        caption: captionText,
      },
    );

    const prevMessage = await ctx.reply(previewText);
    setTimeout(async () => {
      try {
        await ctx.deleteMessage(sentMessage.message_id);
        await ctx.deleteMessage(prevMessage.message_id);
        const originalMessageId =
          ctx.callbackQuery?.message?.message_id || ctx.message?.message_id;

        if (originalMessageId) {
          await ctx.deleteMessage(originalMessageId);
        }
      } catch (err) {
        logger.error({ error: err }, "Failed to delete message:");
        throw err;
      }
    }, 5000);
  } catch (err) {
    logger.error({ error: err }, "Failed to send log file:");
    await ctx.reply("Failed to send logs.");
  }
}

export async function GET_TOPICS(ctx: Context) {
  try {
    const topics = await findManyTopicUsecase.execute({});
    console.log(convertTo2DArray(topics));
    return await ctx.reply(`${topics.length} Topics`, {
      ...Markup.inlineKeyboard(
        convertTo2DArray(topics).map((topicRow) => {
          return topicRow.map((topic) =>
            Markup.button.callback(
              topic.title,
              `${topic.title}-${topic.threadId}`,
            ),
          );
        }),
      ),
    });
  } catch (error) {
    logger.error({ error }, "Failed to fetch topics");
    await ctx.reply("Failed to fetch Topics.");
  }
}
