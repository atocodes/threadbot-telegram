import { app } from "./app";
import { PORT } from "./config/env";
import { logger } from "./config/logger";
import { bot } from "./bots/telegram/bot";
import { sessionMiddleWare } from "./bots/telegram/middlewares/session";
import { Context, Scenes } from "telegraf";
import {
  createPost,
  NewPostState,
} from "./bots/telegram/scenes/createpost.scene";

const port = PORT ?? process.env.PORT;
const stage = new Scenes.Stage<any>([createPost]);
bot.use(sessionMiddleWare);
bot.use(stage.middleware());




bot
  .launch()
  .then(() => logger.info("BOT STARTED"))
  .catch((err) => logger.error(`Telegram Bot Error : ${err}`));
app.listen(port, () => logger.info(`Server started on port ${port}`));
