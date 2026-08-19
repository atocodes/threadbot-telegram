import { Topic } from "../../../domain/entities/topic.model.js";

export type PendingPost = {
    topic?: Topic;
    message?: string;
    prompt?: string;
};

export type NewPostParams = {
    topic: Topic;
    prompt?: string;
};
