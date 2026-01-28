import { TopicRepository } from "../../../domain/repositories"
;;

export class RemoveTopicUsecase {
  constructor(private readonly topicRepo: TopicRepository) {}
  async execute(query: Record<string, any>) {
    await this.topicRepo.removeTopic(query);
  }
}
