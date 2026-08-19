// import { app } from "./app.js";
import { bot } from "./bots/index.js";
import { logger, PORT } from "./infrastructure/config/index.js";

const port = PORT ?? process.env.PORT;
bot
  .launch()
  .then(() => logger.info("BOT STARTED"))
  .catch((err) => {
    logger.error(`Telegram Bot Error : ${err}`);
  });
// app.listen(port, () => logger.info(`Server started on port ${port}`));
