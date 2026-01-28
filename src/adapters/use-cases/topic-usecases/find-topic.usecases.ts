import { Topic } from "../../../domain/entities";
import { TopicRepository } from "../../../domain/repositories"
;;

export class FindTopicUsecase {
  constructor(private readonly topicRepo: TopicRepository) {}
  async execute({ threadId, title }: { threadId?: number; title?: string }) : Promise<Topic | undefined> {
    const topic = await this.topicRepo.findTopic({ threadId, title });
    return topic;
  }
}
