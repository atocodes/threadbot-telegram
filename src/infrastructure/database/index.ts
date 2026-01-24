import { logger } from "../config";
import { contentRequestsDB, topicsDB } from "./nedb/nedb.connection";

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
