import { CreatorRepositoryImpl } from "./prisma/repos/creator.repository.impl.js";
import { TopicRepositoryImpl } from "./prisma/repos/topic.repository.impl.js";

export const topicRepository = new TopicRepositoryImpl();
export const creatorRepository = new CreatorRepositoryImpl();
