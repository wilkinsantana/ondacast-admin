import { books } from '$lib/mock/data';
import type { Audiobook } from '$lib/types/models';

export async function getAudiobooks(): Promise<Audiobook[]> {
  return books;
}
