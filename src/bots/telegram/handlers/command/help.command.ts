import { Context } from "telegraf";
import { logger } from "../../../../infrastructure/index.js";
import { isUserAdmin } from "../../utils/index.js";

export async function HELP_COMMAND(ctx: Context) {
  const helpAdminMessage = `🤖 *Dev Space Assistant Bot — Admin Help*

Available commands:

*/start* — Initialize the bot  
*/createcontent* — Generate content for your topics  
*/seed* — Post content to inactive topics  
*/managetopics* — View and manage your topics  

💡 Use these commands in private chat with the bot.  
🔒 Admin access is required for some features.`;
  const helpUserMessage = `🤖 *Dev Space Assistant Bot*

Welcome! This bot helps manage topics and share useful content in the community.

Use */start* to begin, or contact a topic admin if you need access.`;
  const isAdmin = await isUserAdmin(ctx.from?.id!);
  try {
    await ctx.reply(isAdmin ? helpAdminMessage : helpUserMessage, {
      parse_mode: "Markdown",
    });
  } catch (error) {
    logger.error({ error }, "Unable to create post for topics");
    await ctx.reply(
      "❌ Something went wrong while posting content. Check logs.",
    );
    throw error;
  }
}

/**
/createcontent
/start
/seed
/managetopics
 */
