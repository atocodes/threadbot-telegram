import { User } from "telegraf/types";

export interface Topic {
  title: string;
  id?: number | undefined;
  threadId: number;
  creator?: User;
  lastPostedAt?: string;
}
