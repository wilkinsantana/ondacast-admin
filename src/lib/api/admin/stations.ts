import { stations } from '$lib/mock/data';
import type { Station } from '$lib/types/models';

export async function getStations(): Promise<Station[]> {
  return stations;
}
