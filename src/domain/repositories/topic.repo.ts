import { Topic } from "../entities";

export interface TopicRepository {
  getAll(): Promise<Topic[] | undefined>;
  create(topic: Topic): Promise<void>;
  removeTopic(query: Record<string, any>): Promise<void>;
  findTopic({
    threadId,
    title,
  }: {
    threadId?: number;
    title?: string;
  }): Promise<Topic>;
  findMany(query: Record<string, any>): Promise<Topic[]>;
  updateTopic(topic: Topic): Promise<void>;
}
