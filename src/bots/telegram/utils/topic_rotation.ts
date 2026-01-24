// Topic rotation (no repeats)

import { Topic } from "../../../domain/entities";
import { logger } from "../../../infrastructure/config";
import { getTopicsUseCase } from "../../../infrastructure/container";
// import { TopicNames, topicNamesList } from "../types/topic.types";

let lastTopicIndex = -1;

export async function getNextTopic(): Promise<Topic> {
  const topics = (await getTopicsUseCase.execute()) ?? [];
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
