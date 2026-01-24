import { TopicRepository } from "../../../domain/repositories/topic.repo";

export class UpdateTopicTitleUsecase {
  constructor(private readonly topicRepo: TopicRepository) {}
  async execute({ threadId, title }: { threadId: number; title: string }) {
    await this.topicRepo.updateTopicTitle(title, threadId);
  }
}
