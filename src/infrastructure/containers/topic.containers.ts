import { CreateTopicUsecase, FindManyTopicUsecase, FindTopicUsecase, GetTopicsUsecase, RemoveTopicAdminUsecase, UpdateTopicTitleUsecase } from "../../adapters";
import { TopicRepositoryImpl } from "../database";

const topicRepository = new TopicRepositoryImpl();

export const createTopicUseCase = new CreateTopicUsecase(topicRepository);
export const removeTopicAdminUseCase = new RemoveTopicAdminUsecase(topicRepository);
export const getTopicsUseCase = new GetTopicsUsecase(topicRepository);
export const findTopicUseCase = new FindTopicUsecase(topicRepository);
export const findManyTopicUsecase = new FindManyTopicUsecase(topicRepository);
export const updateTopicUsecase = new UpdateTopicTitleUsecase(
  topicRepository,
);