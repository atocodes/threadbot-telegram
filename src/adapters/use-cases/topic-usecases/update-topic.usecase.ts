import { Topic } from "../../../domain";
import { TopicRepository } from "../../../domain/repositories";

export class UpdateTopicTitleUsecase {
  constructor(private readonly topicRepo: TopicRepository) {}
  async execute({ ...topic }: Topic) {
    console.log(topic)
    await this.topicRepo.updateTopic(topic);
  }
}
