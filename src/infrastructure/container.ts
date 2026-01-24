import {
  CreateTopicUsecase,
  GetRequestedContentsUsecase,
  GetTopicsUsecase,
  RemoveTopicUsecase,
  SubmitContentRequestUsecase,
  UpdateTopicTitleUsecase,
} from "../adapters";
import { FindTopicUsecase } from "../adapters/use-cases/topic-usecases/find-topic.usecases";
import { ContentRequestRepositoryImpl } from "./database/nedb/repositories/contentRequest.reposotory.impl";
import { TopicRepositoryImpl } from "./database/nedb/repositories/topic.repository.impl";

const topicRepository = new TopicRepositoryImpl();
const contentRequestRepository = new ContentRequestRepositoryImpl();

export const createTopicUseCase = new CreateTopicUsecase(topicRepository);
export const removeTopicUseCase = new RemoveTopicUsecase(topicRepository);
export const getTopicsUseCase = new GetTopicsUsecase(topicRepository);
export const findTopicUseCase = new FindTopicUsecase(topicRepository);
export const updateTopicTitleUsecase = new UpdateTopicTitleUsecase(
  topicRepository,
);

export const submitContentRequest = new SubmitContentRequestUsecase(
  contentRequestRepository,
);
export const getRequestedContents = new GetRequestedContentsUsecase(
  contentRequestRepository,
);
export const removeContentRequest = new SubmitContentRequestUsecase(
  contentRequestRepository,
);
