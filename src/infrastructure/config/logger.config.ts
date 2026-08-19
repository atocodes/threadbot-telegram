import pino from "pino";
import fs from "fs";
import { logDir, logFilePath } from "../../constants/index.js";


if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const fileStream = fs.createWriteStream(logFilePath, {
  flags: "a",
});

export const logger = pino(
  {
    level: "info",
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  pino.multistream([
    {
      stream: pino.transport({
        target: "pino-pretty",
        options: { colorize: true },
      }),
    },
    { stream: fileStream },
  ])
);
