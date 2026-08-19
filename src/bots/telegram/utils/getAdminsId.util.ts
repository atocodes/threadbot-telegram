import { SUPER_GROUP_ID } from "../../../infrastructure/config/env.config.js";
import { bot } from "../bot.js";

export const getAdminsId = async () =>
  (await bot.telegram.getChatAdministrators(SUPER_GROUP_ID)).map(
    (admin) => admin.user.id,
  );

export const isUserAdmin = async (userId: number) => {
  try {
    const adminsId = await getAdminsId();
    return adminsId.includes(userId);
  } catch (error) {
    return false;
  }
};
