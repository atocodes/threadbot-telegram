import { logger } from "../config";
import { topicsDB } from "./nedb";

export * from "./nedb";
topicsDB.ensureIndex(
  {
    fieldName: ["title", "threadId"],
    unique: true,
  },
  (err) => {
    if (err) {
      logger.error(`Database Index Error: ${err.name} | ${err.message}`);
    }
  },
);

