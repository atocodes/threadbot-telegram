export class TopicLimitExceededError extends Error {
  constructor(limit: number) {
    super(`Topic limit exceeded: you can create a maximum of ${limit} topics.`);
    this.name = "TopicLimitExceededError";
  }
}
