import { Context, TelegramError } from "telegraf";
import { pendingPosts } from "../../../state/pendingPosts.store";
import { PendingPost } from "../../../types/post.types";
import { postTask } from "../../../tasks/post.task";
import { logger } from "../../../../../infrastructure/config";

export async function POST_CONTENT(ctx: Context) {
  try {
    const userId = ctx.from!.id;
    
    const pending: PendingPost | undefined = pendingPosts.get(userId);
    
    if (!pending) {
      await ctx.answerCbQuery("No post to send.");
      return;
    }

    await postTask(pending);

    pendingPosts.delete(userId);

    await ctx.editMessageText("Posted successfully!!");
 
  } catch (error) {
    if (error instanceof TelegramError) {
      await ctx.editMessageText(
        `Failed to post. Please try again using the /createPost command.`
      );
    }
    logger.error(error);
    return;
  }
}
