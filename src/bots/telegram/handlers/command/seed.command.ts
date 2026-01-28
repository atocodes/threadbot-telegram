import { Context } from "telegraf";
import { findManyTopicUsecase, logger } from "../../../../infrastructure";
import { postTask } from "../../tasks";
import { retry } from "../../utils";

export async function SEED_COMMAND(ctx: Context) {
  try {
    const today = Date.now();
    const topics = await findManyTopicUsecase.execute({});

    if (!topics.length) {
      await ctx.reply("No topics found to post content. 🧐");
      return;
    }

    for (let topic of topics) {
      const last = topic.lastPostedAt
        ? new Date(topic.lastPostedAt!).getTime()
        : 0;
      const MS_PER_HOUR = 1000 * 60 * 60; // 1 hour in ms
      const MS_24_HOURS = MS_PER_HOUR * 24; // 24 hours in ms

      if (!topic.lastPostedAt || today - last > MS_24_HOURS) {
        await retry(() => postTask({ topic }), { retries: 3, delayMs: 1500 });

        const lastPostedText = topic.lastPostedAt
          ? `Last posted: ${new Date(topic.lastPostedAt!).toLocaleString()}`
          : "No previous posts";

        await ctx.reply(
          `✅ Successfully posted new content in topic: "${topic.title}"\n${lastPostedText}`,
        );

        // small delay to avoid flooding
        await new Promise((r) => setTimeout(r, 500));
      } else {
        const hoursSinceLast = Math.floor((today - last) / MS_PER_HOUR);
        await ctx.reply(
          `⏱ Skipped topic: "${topic.title}" — content was posted ${hoursSinceLast}h ago.`,
        );
      }
    }
  } catch (error) {
    logger.error({ error }, "Unable to create post for topics");
    await ctx.reply(
      "❌ Something went wrong while posting content. Check logs.",
    );
    throw error;
  }
}
