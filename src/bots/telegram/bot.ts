import { Telegraf, session } from "telegraf";
import { schedule } from "node-cron";

import { retry } from "./utils/retry.util";
import { actions } from "./handlers/actions";
import { postTask } from "./tasks/post.task";
import { auth, errorMiddleware, threadPostGuard } from "./middlewares";
import { BOTOKEN, logger, NODE_ENV } from "../../infrastructure/config";
import { GETOPICS, startCommand } from "./handlers/command";
import { sudo, topicHearsHandler } from "./handlers/hears";
import {
  stage,
  STARTMANUALPOSTCONVERSATION,
} from "./conversations/createManualPost";
import { AssistantBotContext } from "./types";

if (!BOTOKEN) throw new Error("BOTOKEN not set in .env");

export const bot = new Telegraf<AssistantBotContext>(BOTOKEN!);

bot.on("new_chat_members", (ctx) =>
  logger.info(
    {
      members: ctx.update.message.new_chat_members,
    },
    `New Memeber Joined `,
  ),
);

bot.on("left_chat_member", (ctx) => {
  logger.warn(
    {
      member: ctx.update.message.left_chat_member,
    },
    "Channel Memebr Left",
  );
});

bot.use((ctx, next) => errorMiddleware(ctx, next));
bot.use((ctx, next) => threadPostGuard(ctx, next));
bot.start(startCommand);


bot.use((ctx, next) => auth(ctx, next, bot.telegram));
bot.command("topics", GETOPICS);
bot.use(session());
bot.use(stage.middleware());

// Start conversatinal bot
bot.command("createcontent", STARTMANUALPOSTCONVERSATION);

if (NODE_ENV == "production")
  schedule("*/30 */6 * * */2", async () => {
    /*
    The task runs:
    Every 30 minutes
    During 00, 06, 12, and 18 hours
    On Sun, Tue, Thu, Sat
    All year round 
    */

    try {
      retry(() => postTask({}), {
        retries: 3,
        delayMs: 15000,
      });
    } catch (error) {
      logger.fatal("Cron crashed: " + (error as Error).message);
    }
  });
else {
  logger.warn("Running on development mode");
  logger.warn("!!Schedule post wont be running");
}

bot.hears(/^topic:/i, topicHearsHandler);
bot.hears(/^[Ss]udo$/i, sudo);
Object.entries(actions).forEach(([key, handler]) => {
  bot.action(key, handler);
});
