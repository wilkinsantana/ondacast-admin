import { podcasts } from '$lib/mock/data';
import type { Podcast } from '$lib/types/models';

export async function getPodcasts(): Promise<Podcast[]> {
  return podcasts;
}
