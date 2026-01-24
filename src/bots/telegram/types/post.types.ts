import { Topic } from "../../../domain/entities/topic.model";

export type PendingPost = {
    topic?: Topic;
    message?: string;
};

export type NewPostParams = {
    topic: Topic;
    prompt?: string;
};