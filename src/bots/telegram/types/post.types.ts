import { TopicNames } from "./topic.types";

export type PendingPost = {
    topic?: TopicNames;
    message?: string;
};

export type NewPostParams = {
    topic: TopicNames;
    prompt?: string;
};