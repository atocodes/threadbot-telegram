import * as dotenv from "dotenv";
dotenv.config({
    path:
        process.env.NODE_ENV == "production"
            ? ".env.production"
            : ".env.development"
});
console.log(process.env.NODE_ENV);
export const BOTOKEN = process.env.BOTOKEN!;
export const GEMINI_TOKEN = process.env.GEMINI_TOKEN;
export const PORT = Number(process.env.PORT) || 3000;
export const OLLAMA_API_KEY = process.env.OLLAMA_TOKEN;
