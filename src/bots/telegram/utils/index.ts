import { isPosting, lastPostedAt, updateIsPosting } from "./anti_span_guards";
import { getAdminsId, isUserAdmin } from "./getAdminsId.util";
import { retry } from "./retry.util";
import { SendMessage } from "./send_message.util";
import { getNextTopic } from "./topic_rotation";
import { convertTo2DArray } from "./twoD_array.util";

function escapeMarkdownV2(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, (match) => `\\${match}`);
}


export {
  isPosting,
  lastPostedAt,
  updateIsPosting,
  retry,
  getNextTopic,
  escapeMarkdownV2,
  convertTo2DArray,
  SendMessage,
  isUserAdmin,
  getAdminsId
};
