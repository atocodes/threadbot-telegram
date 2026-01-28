// export const topicNamesList = [
//   "general",
//   "resources",
//   "blogs",
//   "web3",
//   "flutter",
//   "gitngithub",
//   "mongodb",
//   "godot",
//   "nodejs",
//   "linux",
//   "fastapi",
//   "reactnative",
// ] as const; // "as const" makes each item a literal type


// Step 2: Derive the type from the array

// export type TopicNames = (typeof topicNamesList)[number];

// export const TopicIds: Record<TopicNames, number> = {
//   general: NaN, // to send to general topics no id need to be specfied eventho the topic have
//   resources: 35,
//   blogs: 31,
//   web3: 29,
//   flutter: 3,
//   gitngithub: 8,
//   mongodb: 12,
//   godot: 15,
//   nodejs: 727,
//   linux: 729,
//   fastapi: 810,
//   reactnative: 803,
// };
