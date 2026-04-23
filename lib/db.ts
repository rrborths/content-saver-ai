import Dexie, { Table } from 'dexie';

export interface Recommendation {
  name: string;
  url: string;
  use_case: string;
  pros: string;
  cons: string;
  pricing: string;
}

export interface Step {
  step_number: number;
  instruction: string;
  substeps: string[];
}

export interface SavedPost {
  id: string;
  createdAt: Date;
  title: string;
  author: string;
  date: string;
  platform: string;
  contentType: string;
  summary: string;
  keyTakeaways: string[];
  recommendations: Recommendation[];
  stepByStep: Step[];
  commentHighlights: string[];
  linksMentioned: string[];
  tags: string[];
  originalUrl: string;
  raw: any;
}

class ContentSaverDB extends Dexie {
  posts!: Table<SavedPost, string>;

  constructor() {
    super('contentSaverDB');
    this.version(1).stores({
      posts: 'id, createdAt, platform, contentType, *tags'
    });
  }
}

export const db = new ContentSaverDB();
