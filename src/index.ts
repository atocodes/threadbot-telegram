import { app } from "./app";
import { bot } from "./bots";
import { logger, PORT } from "./infrastructure/config";

const port = PORT ?? process.env.PORT;
bot
  .launch()
  .then(() => logger.info("BOT STARTED"))
  .catch((err) => {
    logger.error(`Telegram Bot Error : ${err}`);
  });
app.listen(port, () => logger.info(`Server started on port ${port}`));
