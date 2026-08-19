import { CANCEL_POST, EDIT_POST, POST_CONTENT, REGENERATE_POST } from "./post/index.js";
import { RETRY_PROMPT } from "./prompt/index.js";
import { GET_LOG, GET_TOPICS } from "./sudo/index.js";

export const actions = {
  GET_LOG,
  GET_TOPICS,
  RETRY_PROMPT,
  CANCEL_POST,
  EDIT_POST,
  REGENERATE_POST,
  POST_CONTENT,
};
