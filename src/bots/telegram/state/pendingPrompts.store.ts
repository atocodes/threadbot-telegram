import { NewPostParams } from "../types/post.types";

class PromptStore {
  private prompt = new Map<number, NewPostParams>();

  get(id: number): NewPostParams | undefined {
    return this.prompt.get(id);
  }

  set(id: number, prompt: NewPostParams) {
    this.prompt.set(id, prompt);
  }

  delete(id: number) {
    this.prompt.delete(id);
  }
}

export const pendingPrompts: PromptStore = new PromptStore();
