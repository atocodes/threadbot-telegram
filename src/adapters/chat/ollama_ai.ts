import { Message, Ollama } from "ollama";
import { InlineQueryResultArticle } from "telegraf/types";
import { NewPostParams } from "../../bots/telegram/types/post.types";
import { MegaSystemPrompt } from "./prompts/system.prompts";
import { logger, OLLAMA_API_KEY } from "../../infrastructure/config";

const ollama = new Ollama({
  host: "https://ollama.com",
  headers: {
    Authorization: "Bearer " + OLLAMA_API_KEY,
  },
});

export async function generateOllamaContent({
  topic,
  prompt,
}: NewPostParams): Promise<string | undefined> {
  let responseMsg = "";
  try {
    const message: Message[] = [
      {
        role: "system",
        content: MegaSystemPrompt,
      },
      { role: "user", content: `Topic: ${topic.title}\nGenerate a post.` },
    ];

    if (prompt != null) {
      message.push({
        role: "user",
        content: prompt,
      });
    }
    const response = await ollama.chat({
      model: "gpt-oss:120b",
      messages: message,
      stream: true,
    });

    for await (const part of response) {
      responseMsg += part.message.content;
    }
    return responseMsg;
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

export async function generateOllamaAnswer(
  question: string,
): Promise<InlineQueryResultArticle | undefined> {
  try {
    let responseMsg = "";
    const response = await ollama.chat({
      model: "gpt-oss:120b",
      messages: [
        {
          role: "system",
          content: `
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
        },
        {
          role: "user",
          content: question,
        },
      ],
      stream: true,
    });

    for await (const part of response) {
      responseMsg += part.message.content;
    }
    return JSON.parse(responseMsg);
  } catch (error) {
    logger.error(error);
  }
}
