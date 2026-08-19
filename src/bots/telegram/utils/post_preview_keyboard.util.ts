import { Markup } from "telegraf";

export const postPreviewKeyboard = () =>
  Markup.inlineKeyboard([
    [
      Markup.button.callback("✅ Post", "POST_CONTENT"),
      Markup.button.callback("✏️ Edit", "EDIT_POST"),
    ],
    [Markup.button.callback("🔄 Regenerate", "REGENERATE_POST")],
    [Markup.button.callback("❌ Cancel", "CANCEL_POST")],
  ]);
