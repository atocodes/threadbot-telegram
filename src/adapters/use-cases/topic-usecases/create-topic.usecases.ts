import { Topic } from "../../../domain/entities";
import { TopicRepository } from "../../../domain/repositories/topic.repo";
import { logger } from "../../../infrastructure/config";

export class CreateTopicUsecase {
  constructor(private readonly topicRepo: TopicRepository) {}
  async execute(newTopic: Topic) {
    const topic = await this.topicRepo.findTopic({
      threadId: newTopic.threadId!,
    });
    if (topic) {
      return;
    }
    await this.topicRepo.create(newTopic);
  }
}
