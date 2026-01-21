import { PendingPost } from "../types/post.types";

class SessionStore {
  private sessions = new Map<number, PendingPost>();

  get(id: number): PendingPost | undefined {
    return this.sessions.get(id);
  }

  set(id: number, content: PendingPost) {
    this.sessions.set(id, content);
  }

  delete(id: number) {
    this.sessions.delete(id);
  }
}

export const pendingPosts: SessionStore = new SessionStore();
