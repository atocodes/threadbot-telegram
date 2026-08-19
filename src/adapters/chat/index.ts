import { generateGeminiAnswer, generateGeminiContent } from "./gemini_ai.js";
import { generateOllamaAnswer, generateOllamaContent } from "./ollama_ai.js";
import { generatePostContent } from "./content_fallback.js";

export {
  generateGeminiAnswer,
  generateGeminiContent,
  generateOllamaAnswer,
  generateOllamaContent,
  generatePostContent,
};
