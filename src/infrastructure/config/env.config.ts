import * as dotenv from "dotenv";
import { ENVTYPE } from "../../types/env_type";
dotenv.config({
  path:
    process.env.NODE_ENV == "production"
      ? ".env.production"
      : ".env.development",
});
export const BOTOKEN = process.env.BOTOKEN!;
export const GEMINI_TOKEN = process.env.GEMINI_TOKEN;
export const PORT = Number(process.env.PORT) || 3000;
export const OLLAMA_API_KEY = process.env.OLLAMA_TOKEN;
export const NODE_ENV = process.env.NODE_ENV as ENVTYPE | undefined;
export const SUPER_GROUP_ID = parseInt(process.env.SUPER_GROUP_ID as string);
export const MAXMUM_TOPIC_PER_ADMIN=parseInt(process.env.MAXMUM_TOPIC_PER_ADMIN!) ?? -1

