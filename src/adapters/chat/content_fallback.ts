import { NewPostParams } from "../../bots/telegram/types/post.types.js";
import { logger } from "../../infrastructure/config/index.js";
import { generateGeminiContent } from "./gemini_ai.js";
import { generateOllamaContent } from "./ollama_ai.js";

/** Generates with Ollama, using Gemini only when Ollama fails or is empty. */
export async function generatePostContent({
  topic,
  prompt,
}: NewPostParams): Promise<string | undefined> {
  try {
    const content = await generateOllamaContent({ topic, prompt });
    if (content?.trim()) return content;

    logger.warn({ topic: topic.title }, "Ollama returned empty content; switching to Gemini.");
  } catch (error) {
    logger.warn(
      { error, topic: topic.title },
      "Ollama content generation failed; switching to Gemini.",
    );
  }

  const fallbackContent = await generateGeminiContent({ topic, prompt });
  if (!fallbackContent?.trim()) {
    logger.error({ topic: topic.title }, "Gemini fallback returned no content.");
    return undefined;
  }

  return fallbackContent;
}
