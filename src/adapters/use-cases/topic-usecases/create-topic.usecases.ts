import { Topic } from "../../../domain/entities";
import { TopicLimitExceededError } from "../../../domain/errors/topic-limit-exceeded.error";
import { TopicRepository } from "../../../domain/repositories";
import { MAXMUM_TOPIC_PER_ADMIN } from "../../../infrastructure/config/env.config";

export class CreateTopicUsecase {
  constructor(private readonly topicRepo: TopicRepository) {}
  async execute(newTopic: Topic) {
    const topic = await this.topicRepo.findTopic({
      threadId: newTopic.threadId!,
    });
    const creatorTopics = await this.topicRepo.findMany({
      "creator.id": newTopic.creator!.id,
    });
    if (topic) {
      return;
    }
    if (
      MAXMUM_TOPIC_PER_ADMIN > 0 &&
      creatorTopics.length >= MAXMUM_TOPIC_PER_ADMIN
    ) {
      throw new TopicLimitExceededError(MAXMUM_TOPIC_PER_ADMIN);
    }
    await this.topicRepo.create(newTopic);
  }
}
