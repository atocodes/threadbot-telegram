import { CANCEL_POST } from "./post/cancelPost.action";
import { CHANGE_POST } from "./post/changePost.action";
import { POST_CONTENT } from "./post/post.action";

import { RETRY_PROMPT } from "./prompt/retryPrompt.action";
import { GET_TOPICS } from "./sudo/getTopics.action";
import { GET_LOG } from "./sudo/sendLogFile.actions";

export const actions = {
  POST_CONTENT,
  CHANGE_POST,
  CANCEL_POST,
  RETRY_PROMPT,
  GET_LOG,
  GET_TOPICS,
};
