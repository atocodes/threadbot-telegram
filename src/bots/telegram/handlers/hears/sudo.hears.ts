import { Context, Markup } from "telegraf";
import { SUDOUSERID } from "../../../../infrastructure/config/env.config";

export async function sudo(ctx: Context) {
  const userId = ctx.from?.id;
  if (userId == SUDOUSERID) {
    await ctx.reply(
      "*SUDO OPTIONS*\n\nSelect an action to perform administrative tasks:",
      {
        parse_mode: "Markdown",
        ...Markup.inlineKeyboard([
          [
            Markup.button.callback("Get Logs", "GET_LOG"),

            Markup.button.callback("Get Topics", "GET_TOPICS"),
          ],
        ]),
      },
    );
  }
}
