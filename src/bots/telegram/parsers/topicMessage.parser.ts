import { NewPostParams } from "../types/post.types";

// export function parseTopicMessage(text: string): NewPostParams {
//   const parts = Object.fromEntries(
//     text.split("|").map((p) => {
//       const [key, ...rest] = p.split(":");
//       return [key.trim().toLowerCase(), rest.join(":").trim()];
//     })
//   );
//   const topic = parts.topic as TopicNames;
//   const prompt = parts.prompt;

//   if (!topic || !prompt) {
//     throw new Error("INVALID_FORMAT");
//   }
//   return parts as NewPostParams;
// }
