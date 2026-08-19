import { CreatorRepo } from "../../../../domain/repositories/creator.repo.js";
import { prisma } from "../prisma.js";

export class CreatorRepositoryImpl implements CreatorRepo {
  find(tg_id: number): Promise<any> {
    return prisma.creator.findUnique({
      where: {
        tg_id,
      },
    });
  }
}
