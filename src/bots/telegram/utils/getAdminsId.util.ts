import { SUPER_GROUP_ID } from "../../../infrastructure/config/env.config";
import { bot } from "../bot";

export const getAdminsId = async () =>
  (await bot.telegram.getChatAdministrators(SUPER_GROUP_ID)).map(
    (admin) => admin.user.id,
  );

export const isUserAdmin = async (userId: number) => {
  const adminsId = await getAdminsId();
  return adminsId.includes(userId);
};
