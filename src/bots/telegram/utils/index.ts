import { isPosting, lastPostedAt, updateIsPosting } from "./anti_span_guards.js";
import { getAdminsId, isUserAdmin } from "./getAdminsId.util.js";
import { retry } from "./retry.util.js";
import { postPreviewKeyboard } from "./post_preview_keyboard.util.js";
import { SendMessage } from "./send_message.util.js";
import { getNextTopic } from "./topic_rotation.js";
import { convertTo2DArray } from "./twoD_array.util.js";

function escapeMarkdownV2(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, (match) => `\\${match}`);
}


export {
  isPosting,
  lastPostedAt,
  updateIsPosting,
  retry,
  postPreviewKeyboard,
  getNextTopic,
  escapeMarkdownV2,
  convertTo2DArray,
  SendMessage,
  isUserAdmin,
  getAdminsId
};
