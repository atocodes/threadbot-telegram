import { TopicRepository } from "../../../domain/repositories"
;;

export class GetTopicsUsecase {
  constructor(private readonly topicRepo: TopicRepository) {}
  async execute() {
    const topics = await this.topicRepo.getAll();
    return topics;
  }
}
