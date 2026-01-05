import { TopicNames } from "../constants/topics";

export type PendingPost = {
  topic: TopicNames;
  message: string;
};
export const pendingPosts = new Map<number, PendingPost>();
