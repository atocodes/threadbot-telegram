import Datastore from "@seald-io/nedb";
import path from "node:path";
import { databaseDir } from "../../../constants";
import { Topic } from "../../../domain/entities";

export const topicsDB = new Datastore<Topic>({
  filename: path.join(databaseDir, "topics.db"),
  autoload: true,
});
