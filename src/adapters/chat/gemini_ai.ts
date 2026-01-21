import {
  GoogleGenerativeAI,
  GoogleGenerativeAIFetchError,
} from "@google/generative-ai";
import { InlineQueryResultArticle } from "telegraf/types";
import { NewPostParams } from "../../bots/telegram/types/post.types";
import { SystemPrompts } from "./prompts/system.prompts";
import { GEMINI_TOKEN, logger } from "../../infrastructure/config";

const ai = new GoogleGenerativeAI(GEMINI_TOKEN!);
export async function generateGeminiContent({
  topic,
  prompt,
}: NewPostParams): Promise<string | undefined | null> {
  try {
    const model = ai.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SystemPrompts[topic],
    });
    const result = await model.generateContent(prompt ?? "");
    const response = await result.response;
    return response.text();
  } catch (error) {
    if (error instanceof GoogleGenerativeAIFetchError) {
      logger.warn({
        msg: `❌ Cannot create content from Gemini.
        ${[`Status: ${error.status}`, `Msg: ${error.statusText}`]}
        Switching to Ollama...`,
      });
      return null;
    }

    logger.error(`Gemini Unknown Error : ${error}`);
  }
}

export async function generateGeminiAnswer(
  question: string
): Promise<InlineQueryResultArticle | undefined> {
  try {
    let responseStr = "";
    const model = ai.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `
        You are a Telegram bot assistant.

Your task is to generate answer ONLY for a Telegram InlineQueryResultArticle
for the given topic.

Rules:
- Generate content ONLY for specififed topic.
- Do NOT explain anything.
- Do NOT include extra text, comments, or formatting.
- Do NOT use Markdown.
- The result must be suitable to be mapped directly into this structure:

{
  type: "article",
  id: string,
  title: string,
  input_message_content: {
    message_text: string
  },
  description: string
}

Content rules:
- title must clearly indicate sending a message to the given topic.
- input_message_content.message_text must be short, clear, and relevant to the topic.
- description must briefly describe the topic purpose or destination.
- Keep message_text concise (1–3 lines max).
- Use ONLY Telegram-compatible HTML tags if needed.

You will be given a topic name.
Generate content ONLY related to that topic.
        `,
    });

    const result = await model.generateContent(question);
    const response = await result.response.text();
    return JSON.parse(response);
  } catch (error) {
    logger.error(error);
  }
}
