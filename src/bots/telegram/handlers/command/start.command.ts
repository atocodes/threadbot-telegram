import { Context } from "telegraf";
import { getAdminsId } from "../../middlewares/index.js";

export async function startCommand(ctx: Context) {
  const user = ctx.from!;
  const admins = await getAdminsId();
  const isUserAdmin = admins.includes(user.id);

  const userName = `${user.first_name}${user.last_name ? " " + user.last_name : ""}`;
  const atodevspaceLink = `<a href="https://t.me/atodevspace"><b>@atodevspace</b></a>`;

  const adminResponse = `<b>DevSpace Assistant — Admin Info</b>

📌 <b>Topic rules:</b>
• Max <b>4 topics</b> per admin
• After creating a topic, send <code>register</code> <b>inside the topic</b>
• You can only manage <b>topics you registered</b>
• Unregistered topics won’t work with the bot

🧠 <b>Content creation:</b>  
Use /createcontent <b>on the bot</b> to generate content for your registered topics.

⚠️ No registration = no automation.
`;

  const userResponse = `<b>Hello ${userName}! 😎 I’m ወይዘሮ Codes (aka Hasu Codes)</b>
<i>Your official ${atodevspaceLink} Supergroup Content Manager 🤖✨</i>

Just so you know: I work <b>exclusively in this supergroup</b> to create posts, spark discussions, and manage content.  

💡 Coming soon: I’ll be able to take topic suggestions from members and turn them into posts for the group.

Until then, sit back, enjoy the posts, and watch me do my <b>multi-AI magic 💥</b>`;

  await ctx.reply(isUserAdmin ? adminResponse : userResponse, {
    parse_mode: "HTML",
  });
}
