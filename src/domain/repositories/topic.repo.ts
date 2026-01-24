import { Topic } from "../entities";

export interface TopicRepository {
  getAll(): Promise<Topic[] | undefined>;
  create(topic: Topic): Promise<void>;
  remove(id: number): Promise<void>;
  findTopic({
    threadId,
    title,
  }: {
    threadId?: number;
    title?: string;
  }): Promise<Topic>;
  updateTopicTitle(title: string, threadId: number): Promise<void>;
}
