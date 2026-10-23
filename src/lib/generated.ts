import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
export interface Contribution { date: string; level: number; count: number | null; }
export interface GithubData { available: boolean; user: string; days: Contribution[]; total: number; fetchedAt?: string; }
export interface FeedItem { title: string; url: string; author: string; date: string | null; }
export async function githubData(): Promise<GithubData> {
  try { return JSON.parse(await readFile(resolve('src/generated/github.json'), 'utf8')); }
  catch { return { available: false, user: '', days: [], total: 0 }; }
}
export async function friendData(): Promise<{ items: FeedItem[]; fetchedAt?: string; failed?: number }> {
  try { return JSON.parse(await readFile(resolve('src/generated/friends.json'), 'utf8')); }
  catch { return { items: [] }; }
}
