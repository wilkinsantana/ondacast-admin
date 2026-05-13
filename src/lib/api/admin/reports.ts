import { reports } from '$lib/mock/data';
import type { Report } from '$lib/types/models';

export async function getReports(filter: string = 'open'): Promise<Report[]> {
  if (filter === 'all') return reports;
  return reports.filter((r) => r.status === filter);
}
