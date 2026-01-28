import { Topic } from "../../../../domain/entities";
import { TopicRepository } from "../../../../domain/repositories/topic.repo";
import { topicsDB } from "../nedb.connection";

export class TopicRepositoryImpl implements TopicRepository {
  async getAll(): Promise<Topic[] | undefined> {
    try {
      const topics = await topicsDB.getAllData();
      return topics;
    } catch (error) {
      throw error;
    }
  }

  async removeTopic(query: Record<string, any>): Promise<void> {
    try {
      await topicsDB.removeAsync({ ...query }, {});
    } catch (error) {
      throw error;
    }
  }

  async findMany(query: Record<string, any>): Promise<Topic[] | []> {
    try {
      const res = await topicsDB.findAsync(query, { _id: 1 });
      return res ?? [];
    } catch (error) {
      throw error;
    }
  }

  async findTopic({
    threadId,
    title,
  }: {
    threadId?: number;
    title?: string;
  }): Promise<Topic> {
    try {
      const query: Record<string, any> = {};
      // filter the quries from the undefined values
      Object.entries({ threadId, title }).forEach((param) => {
        const [key, value] = param;
        if (value == undefined) return;
        query[key] = value;
      });
      const topic = await topicsDB.findOneAsync(query, { _id: 1 });

      return topic;
    } catch (error) {
      throw error;
    }
  }

  async updateTopic(topic: Topic): Promise<void> {
    try {
      console.log(topic);
      await topicsDB.updateAsync(
        { threadId: topic.threadId },
        { $set: { ...topic } },
        { multi: false, upsert: false },
      );
    } catch (error) {
      throw error;
    }
  }

  async create(topic: Topic): Promise<void> {
    try {
      await topicsDB.insertAsync(topic);
    } catch (error) {
      throw error;
    }
  }
}
