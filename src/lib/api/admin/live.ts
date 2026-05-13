import { stations } from '$lib/mock/data';
import type { Station } from '$lib/types/models';

export interface LiveStats {
  total: number;
  live: number;
  degraded: number;
  offline: number;
  total_listeners: number;
}

export async function getLiveStats(): Promise<LiveStats> {
  const live = stations.filter((s) => s.status === 'live').length;
  const degraded = stations.filter((s) => s.status === 'degraded').length;
  const offline = stations.filter((s) => s.status === 'offline').length;
  const totalListeners = stations.reduce((sum, s) => sum + (s.listeners ?? 0), 0);

  return {
    total: stations.length,
    live,
    degraded,
    offline,
    total_listeners: totalListeners,
  };
}

export async function getLiveStations(filter: string = 'all'): Promise<Station[]> {
  if (filter === 'all') return stations;
  return stations.filter((s) => s.status === filter);
}
