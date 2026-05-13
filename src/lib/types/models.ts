export interface Station {
  id: string;
  name: string;
  call: string;
  band: 'FM' | 'AM' | 'WEB' | 'NOAA';
  freq: number | null;
  city: string;
  country: string;
  category: string;
  listeners: number;
  hue: number;
  status: 'live' | 'degraded' | 'offline';
  hd: boolean;
  bitrate: number;
  streamUrl?: string;
}

export interface Report {
  id: string;
  stationId: string;
  station: string;
  kind: string;
  reporter: string;
  ago: string;
  count: number;
  status: 'open' | 'review' | 'resolved' | 'dismissed';
}

export interface Podcast {
  id: string;
  title: string;
  publisher: string;
  category: string;
  episodes: number;
  downloads: number;
  status: 'live' | 'draft';
}

export interface Audiobook {
  id: string;
  title: string;
  author: string;
  narrator: string;
  genre: string;
  chapters: number;
  hours: number;
  owned: number;
}

export interface OCUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'user';
  plan: string;
  status: 'active' | 'pending' | 'suspended';
  last: string;
  signed: string;
  hue: number;
  passkey: boolean;
  sessions: number;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  trial: number;
  audience: string;
  featured?: boolean;
  features: string[];
}

export interface Payment {
  id: string;
  user: string;
  amount: number;
  plan: string;
  method: string;
  status: 'succeeded' | 'failed' | 'refunded';
  at: string;
}

export interface Coupon {
  code: string;
  desc: string;
  redeems: number;
  cap: number | null;
  plans: string[];
  status: 'active' | 'archived';
  ends: string;
}

export interface OCSubscription {
  id: string;
  user: string;
  plan: string;
  status: 'active' | 'trialing' | 'past_due' | 'canceled';
  started: string;
}

export interface PageItem {
  id: string;
  title: string;
  slug: string;
  updated: string;
  status: 'published' | 'draft';
}

export interface BlogPost {
  id: string;
  title: string;
  author: string;
  status: 'published' | 'draft' | 'scheduled';
  date: string;
  tags: string[];
}

export interface AuditEntry {
  who: string;
  icon: string;
  color: string;
  what: string;
  ago: string;
}

export interface ThemeItem {
  id: string;
  name: string;
  colors: string[];
  active: boolean;
  builtin: boolean;
}

export interface FeatureFlag {
  key: string;
  on: boolean;
  rollout: number;
  env: string;
}

export interface WebhookItem {
  id: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive';
  last: string;
}

export interface APIKeyItem {
  id: string;
  name: string;
  key: string;
  created: string;
  last: string;
}

export interface SessionItem {
  id: string;
  user: string;
  device: string;
  ip: string;
  started: string;
  auth: string;
}

export interface InviteItem {
  id: string;
  email: string;
  role: string;
  sent: string;
  status: 'pending' | 'accepted' | 'expired';
}

export interface NavItem {
  label: string;
  path: string;
  sub?: string;
}
