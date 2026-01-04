// Topic rotation (no repeats)

export const topics = [
  "general",
  "resources",
  "blogs",
  "web3",
  "flutter",
  "gitngithub",
  "mongodb",
  "godot",
] as const;

export type TopicNames = (typeof topics)[number];

let lastTopicIndex = -1;

export function getNextTopic(): TopicNames {
  lastTopicIndex = (lastTopicIndex + 1) % topics.length;
  return topics[lastTopicIndex];
}

// ✅ No randomness
// ✅ Predictable
// ✅ Every topic gets equal exposure
