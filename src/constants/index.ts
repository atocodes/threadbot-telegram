import path from "path";
import { MIN_INTERVAL } from "./post.constants";
import fs from "fs";
//import publicTopicIds from "./topic.constants"
const logDir = path.join(process.cwd(), "logs");
const databaseDir = path.join(process.cwd(), "db");
const logFilePath = path.join(logDir, "app.log");
const sqlFilePath = path.join(databaseDir, "mydb.sqlite");

if (!fs.existsSync(databaseDir)) {
    fs.mkdirSync(databaseDir);
}

export {
    MIN_INTERVAL,
    logDir,
    logFilePath,
    sqlFilePath,
    databaseDir
};
