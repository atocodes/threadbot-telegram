import { TopicRepository } from "../../../domain/repositories"
;;

export class RemoveTopicAdminUsecase {
  constructor(private readonly topicRepo: TopicRepository) {}
  async execute(query: Record<string, any>) {
    await this.topicRepo.removeTopicAdmin(query);
  }
}
