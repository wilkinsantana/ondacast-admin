import { apiFetch } from '$lib/api/client';

export type AnnouncementStyle = 'typewriter' | 'fade' | 'slide' | 'none';
export type AnnouncementColorTheme = 'yellow' | 'blue' | 'green' | 'red' | 'purple' | 'dark';
export type AnnouncementTarget = 'all' | 'logged_in' | 'guests' | 'admin';

export interface Announcement {
  id: number;
  title: string;
  message: string;
  style: AnnouncementStyle;
  color_theme: AnnouncementColorTheme;
  target: AnnouncementTarget;
  priority: number;
  start_time: string | null;
  end_time: string | null;
  is_dismissible: boolean;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface AnnouncementCreate {
  title: string;
  message: string;
  style?: AnnouncementStyle;
  color_theme?: AnnouncementColorTheme;
  target?: AnnouncementTarget;
  priority?: number;
  start_time?: string | null;
  end_time?: string | null;
  is_dismissible?: boolean;
  is_active?: boolean;
}

export async function listAnnouncements(): Promise<Announcement[]> {
  const res = await apiFetch<{ announcements: Announcement[] }>('/announcements/admin');
  return res.announcements;
}

export async function createAnnouncement(body: AnnouncementCreate): Promise<Announcement> {
  const res = await apiFetch<{ ok: boolean; announcement: Announcement }>('/announcements/admin', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return res.announcement;
}

export async function updateAnnouncement(id: number, body: Partial<AnnouncementCreate>): Promise<Announcement> {
  const res = await apiFetch<{ ok: boolean; announcement: Announcement }>(`/announcements/admin/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
  return res.announcement;
}

export async function deleteAnnouncement(id: number): Promise<void> {
  await apiFetch(`/announcements/admin/${id}`, { method: 'DELETE' });
}
