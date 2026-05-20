import {
  LayoutDashboard, Radio, Monitor, ClipboardList, RadioTower, Flag,
  Podcast, BookOpen, Music, Tags, Users, ShieldCheck, MonitorSmartphone,
  Mail, CreditCard, Package, DollarSign, Ticket, FileText, FileEdit,
  Menu, Search, HelpCircle, Palette, Image, Megaphone, Settings,
  Shield, Key, Webhook, Bell, Globe, Signal, GitBranch, Cloud, FlaskConical
} from 'lucide-svelte';

export interface NavGroup {
  group: string;
  items: NavEntry[];
}

export interface NavEntry {
  id: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  badge?: { tone: string; text: string };
}

export const NAV: NavGroup[] = [
  {
    group: 'OVERVIEW',
    items: [
      { id: 'dashboard',  label: 'Dashboard',      icon: LayoutDashboard, badge: undefined },
      { id: 'live',       label: 'Live monitor',   icon: Monitor,        badge: { tone: 'amber', text: '12' } },
      { id: 'audit',      label: 'Audit log',      icon: ClipboardList,  badge: undefined },
    ],
  },
  {
    group: 'CONTENT',
    items: [
      { id: 'stations',   label: 'Radio stations',  icon: RadioTower,    badge: undefined },
      { id: 'hd',         label: 'HD subchannels',  icon: Signal,        badge: undefined },
      { id: 'reports',    label: 'Reported',        icon: Flag,          badge: { tone: '', text: '8' } },
      { id: 'podcasts',   label: 'Podcasts',        icon: Podcast,       badge: undefined },
      { id: 'audiobooks', label: 'Audiobooks',      icon: BookOpen,      badge: undefined },
      { id: 'metadata',   label: 'Now-playing',     icon: Music,         badge: undefined },
      { id: 'categories', label: 'Categories',      icon: Tags,          badge: undefined },
      { id: 'tv',         label: 'TV Playlists',   icon: Monitor,       badge: undefined },
      { id: 'tv/channels',label: 'TV Channels',    icon: Radio,         badge: undefined },
    ],
  },
  {
    group: 'PEOPLE',
    items: [
      { id: 'users',      label: 'Users',           icon: Users,         badge: undefined },
      { id: 'roles',      label: 'Roles & perms',   icon: ShieldCheck,   badge: undefined },
      { id: 'sessions',   label: 'Active sessions', icon: MonitorSmartphone, badge: undefined },
      { id: 'invites',    label: 'Invites',         icon: Mail,          badge: undefined },
    ],
  },
  {
    group: 'COMMERCE',
    items: [
      { id: 'subs',       label: 'Subscriptions',   icon: CreditCard,    badge: undefined },
      { id: 'plans',      label: 'Plans / Packages',icon: Package,       badge: undefined },
      { id: 'payments',   label: 'Payments',        icon: DollarSign,    badge: undefined },
      { id: 'coupons',    label: 'Coupons',         icon: Ticket,        badge: undefined },
    ],
  },
  {
    group: 'SITE',
    items: [
      { id: 'pages',      label: 'Pages',           icon: FileText,      badge: undefined },
      { id: 'blog',       label: 'Blog',            icon: FileEdit,      badge: undefined },
      { id: 'nav',        label: 'Navigation',      icon: Menu,          badge: undefined },
      { id: 'seo',        label: 'SEO & meta',      icon: Search,        badge: undefined },
      { id: 'help',       label: 'Help center',     icon: HelpCircle,    badge: undefined },
    ],
  },
  {
    group: 'OUTREACH',
    items: [
      { id: 'announcements', label: 'Announcements', icon: Megaphone, badge: undefined },
    ],
  },
  {
    group: 'BRAND',
    items: [
      { id: 'themes',     label: 'Themes',          icon: Palette,       badge: undefined },
      { id: 'branding',   label: 'Logos & favicon', icon: Image,         badge: undefined },
      { id: 'marketing',  label: 'Marketing copy',  icon: Megaphone,     badge: undefined },
    ],
  },
  {
    group: 'SYSTEM',
    items: [
      { id: 'settings',   label: 'General',         icon: Settings,      badge: undefined },
      { id: 'smtp',       label: 'Email / SMTP',    icon: Mail,          badge: undefined },
      { id: 'auth',       label: 'Auth & security', icon: Shield,        badge: undefined },
      { id: 'api',        label: 'API keys',        icon: Key,           badge: undefined },
      { id: 'webhooks',   label: 'Webhooks',        icon: Webhook,       badge: undefined },
      { id: 'push',       label: 'Push & media',    icon: Bell,          badge: undefined },
      { id: 'geo',        label: 'Geo & data feeds',icon: Globe,         badge: undefined },
      { id: 'audio',      label: 'Audio engine',    icon: Signal,        badge: undefined },
      { id: 'mobile',     label: 'Mobile builds',   icon: GitBranch,     badge: undefined },
      { id: 'backups',    label: 'Backups',         icon: Cloud,         badge: undefined },
      { id: 'flags',      label: 'Feature flags',   icon: FlaskConical,  badge: undefined },
    ],
  },
];

export const ALL_ITEMS = NAV.flatMap((g) => g.items);

export function getNavItem(id: string): NavEntry | undefined {
  return ALL_ITEMS.find((i) => i.id === id);
}

export function getGroupFor(id: string): string | undefined {
  return NAV.find((g) => g.items.some((i) => i.id === id))?.group;
}
