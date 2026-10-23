import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
export interface FeedItem { title: string; url: string; author: string; date: string | null; }
export async function friendData(): Promise<{ items: FeedItem[]; fetchedAt?: string; failed?: number }> {
  try { return JSON.parse(await readFile(resolve('src/generated/friends.json'), 'utf8')); }
  catch { return { items: [] }; }
}
