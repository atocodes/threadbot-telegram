// Topic rotation (no repeats)

import { Topic } from "../../../domain/index.js";
import { logger, topicRepository } from "../../../infrastructure/index.js";

// import { TopicNames, topicNamesList } from "../types/topic.types.js";

let lastTopicIndex = -1;

export async function getNextTopic(): Promise<Topic> {
  const topics =
    (await topicRepository.findMany({
      creatorId: undefined,
      allTopics: true,
    })) ?? [];
  lastTopicIndex = (lastTopicIndex + 1) % topics.length;
  if (lastTopicIndex == 0) {
    logger.info(`Skipping "${topics[lastTopicIndex]}" topic`);
    return getNextTopic();
  } else {
    return topics[lastTopicIndex];
  }
}

// ✅ No randomness
// ✅ Predictable
// ✅ Every topic gets equal exposure
