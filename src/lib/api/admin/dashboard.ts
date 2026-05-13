import { apiFetch } from '$lib/api/client';
import { stations, reports, auditLog } from '$lib/mock/data';
import type { Station, Report, AuditEntry, Podcast, Audiobook } from '$lib/types/models';

export interface DashboardStats {
  total_stations: number;
  live_stations: number;
  total_listeners: number;
  hd_channels: number;
  active_reports: number;
  revenue_mrr: number;
  plus_subs: number;
  team_subs: number;
}

export interface RevenuePoint {
  month: string;
  revenue: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const live = stations.filter((s) => s.status === 'live').length;
  const totalListeners = stations.reduce((sum, s) => sum + (s.listeners ?? 0), 0);
  const hdCount = stations.filter((s) => s.hd).length;
  const openReports = reports.filter((r) => r.status === 'open' || r.status === 'review').length;

  return {
    total_stations: stations.length,
    live_stations: live,
    total_listeners: totalListeners,
    hd_channels: hdCount,
    active_reports: openReports,
    revenue_mrr: 8472,
    plus_subs: 412,
    team_subs: 89,
  };
}

export async function getRecentActivity(): Promise<AuditEntry[]> {
  return auditLog;
}

export async function getTopStations(): Promise<Station[]> {
  return [...stations].sort((a, b) => (b.listeners ?? 0) - (a.listeners ?? 0)).slice(0, 5);
}

export async function getOpenReports(): Promise<Report[]> {
  return reports.filter((r) => r.status === 'open');
}

export async function getRevenueHistory(): Promise<RevenuePoint[]> {
  return [
    { month: 'Jan', revenue: 6200 },
    { month: 'Feb', revenue: 6450 },
    { month: 'Mar', revenue: 6890 },
    { month: 'Apr', revenue: 7120 },
    { month: 'May', revenue: 7810 },
    { month: 'Jun', revenue: 8472 },
  ];
}
