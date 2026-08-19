import { Topic } from "../../../../domain/entities/index.js";
import { TopicRepository } from "../../../../domain/repositories/topic.repo.js";
import { prisma } from "../prisma.js";

export class TopicRepositoryImpl implements TopicRepository {
  async getAll(): Promise<Topic[] | undefined> {
    // return await prisma.topic.findMany({
    //   include: {
    //     creator: true,
    //   },
    // });
    return [];
  }
  async create(topic: Topic): Promise<void> {
    if (!topic.creator) throw new Error("Creator not specified");
    let creator = await prisma.creator.findFirst({
      where: { tg_id: topic.creator?.id },
    });

    if (!creator) {
      creator = await prisma.creator.create({
        data: {
          first_name: topic.creator?.first_name,
          language_code: topic.creator?.language_code ?? "",
          last_name: topic.creator?.last_name ?? "",
          tg_id: topic.creator?.id,
          username: topic.creator?.username ?? "",
          is_bot: topic.creator?.is_bot,
        },
      });
    }

    await prisma.topic.create({
      data: {
        threadId: topic.threadId,
        title: topic.title,
        creatorId: creator.id,
      },
    });
    // if (topic.creator == null) throw new Error("Creator Not Found");
  }
  async removeTopicAdmin(query: { threadId: number }): Promise<void> {
    const topic = await prisma.topic.findUnique({
      where: { threadId: query.threadId },
    });

    if (!topic) throw new Error("Topic not found");
    if (!topic.creatorId) throw new Error("Creator not set for this topic");

    await prisma.creator.delete({ where: { id: topic.creatorId! } });
  }
  async findTopic({
    threadId,
    title,
  }: {
    threadId?: number;
    title?: string;
  }): Promise<any | undefined> {
    var topic = await prisma.topic.findUnique({
      where: {
        threadId,
      },
    });
    return topic;
  }
  async findMany({
    creatorId,
    allTopics = false,
  }: {
    creatorId: number | undefined;
    allTopics?: boolean;
  }): Promise<any[]> {
    if (allTopics) return await prisma.topic.findMany();

    if (!creatorId) throw new Error("Creator id not specified");
    const creator = await prisma.creator.findFirst({
      where: { tg_id: creatorId },
    });

    if (!creator) throw new Error("Creator Not found");

    const topics = await prisma.topic.findMany({
      where: { creatorId: creator.id },
    });

    return topics;
  }
  async updateTopic(topic: Topic): Promise<void> {
    console.log(topic, "UPDATE TOPICCCCCCCCC");
  }
}
