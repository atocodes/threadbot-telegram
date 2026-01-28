import { session, Telegraf } from "telegraf";
import { BOTOKEN, logger, NODE_ENV } from "../../infrastructure";
import { AssistantBotContext } from "./types";
import {
  auth,
  errorMiddleware,
  threadPostGuard,
  updateTopic,
} from "./middlewares";
import { actions, registerTopic, SEED_COMMAND, startCommand, sudo } from "./handlers";
import {
  stage,
  STARTMANAGETOPICCONVERSATION,
  STARTMANUALPOSTCONVERSATION,
} from "./conversations";
import { retry } from "./utils";
import { postTask } from "./tasks";
import { schedule } from "node-cron";

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

// Hears
bot.hears(/^register$/gi, registerTopic);
bot.hears(/^[Ss]udo$/i, sudo);

bot.use(session());
bot.use(stage.middleware());

// Start conversatinal bot
bot.command("createcontent", STARTMANUALPOSTCONVERSATION);
bot.command("managetopics", STARTMANAGETOPICCONVERSATION);
bot.command("seed",SEED_COMMAND)
bot.on("message", updateTopic);

if (NODE_ENV == "production")
  schedule("*/30 */2 * * *", async () => {
    /*
    The task runs:
    Every 30 minutes in 2 Hrs
    Everyday
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

Object.entries(actions).forEach(([key, handler]) => {
  bot.action(key, handler);
});
