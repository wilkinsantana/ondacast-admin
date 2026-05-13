import type { Station, Report, Podcast, Audiobook, OCUser, Plan, Payment, Coupon, OCSubscription, PageItem, BlogPost, AuditEntry, ThemeItem, FeatureFlag, SessionItem, InviteItem, APIKeyItem, WebhookItem } from '$lib/types/models';

export const stations: Station[] = [
  { id: 's001', name: 'KEXP',                  call: 'KEXP', band: 'FM',  freq: 90.3,    city: 'Seattle',     country: 'US', category: 'Indie',       listeners: 14820, hue: 30,  status: 'live',   hd: true, bitrate: 128 },
  { id: 's002', name: 'WFMU',                  call: 'WFMU', band: 'FM',  freq: 91.1,    city: 'Jersey City', country: 'US', category: 'Eclectic',    listeners: 8200,  hue: 280, status: 'live',   hd: false, bitrate: 128 },
  { id: 's003', name: 'BBC Radio 6',           call: 'BBC6', band: 'WEB', freq: null,    city: 'London',      country: 'GB', category: 'Alternative', listeners: 22440, hue: 200, status: 'live',   hd: false, bitrate: 320 },
  { id: 's004', name: 'Radio Paradise Main',   call: 'RPMM', band: 'WEB', freq: null,    city: 'Paradise',    country: 'US', category: 'Eclectic',    listeners: 5810,  hue: 145, status: 'live',   hd: false, bitrate: 320 },
  { id: 's005', name: 'WNYC FM',               call: 'WNYC', band: 'FM',  freq: 93.9,    city: 'New York',    country: 'US', category: 'Public',      listeners: 18700, hue: 220, status: 'live',   hd: true, bitrate: 128 },
  { id: 's006', name: 'KCRW Eclectic',         call: 'KCRW', band: 'WEB', freq: null,    city: 'Santa Monica',country: 'US', category: 'Eclectic',    listeners: 9120,  hue: 50,  status: 'live',   hd: false, bitrate: 192 },
  { id: 's007', name: 'FIP',                   call: 'FIP',  band: 'WEB', freq: null,    city: 'Paris',       country: 'FR', category: 'World',       listeners: 11250, hue: 320, status: 'live',   hd: false, bitrate: 192 },
  { id: 's008', name: 'WWOZ New Orleans',      call: 'WWOZ', band: 'FM',  freq: 90.7,    city: 'New Orleans', country: 'US', category: 'Jazz',        listeners: 4310,  hue: 25,  status: 'live',   hd: false, bitrate: 96 },
  { id: 's009', name: 'Rinse FM',              call: 'RNSE', band: 'FM',  freq: 106.8,   city: 'London',      country: 'GB', category: 'Electronic',  listeners: 7860,  hue: 175, status: 'offline',hd: false, bitrate: 128 },
  { id: 's010', name: 'NTS Radio 1',           call: 'NTS1', band: 'WEB', freq: null,    city: 'London',      country: 'GB', category: 'Underground', listeners: 12600, hue: 260, status: 'live',   hd: false, bitrate: 192 },
  { id: 's011', name: 'WBUR Boston',           call: 'WBUR', band: 'FM',  freq: 90.9,    city: 'Boston',      country: 'US', category: 'Public',      listeners: 6300,  hue: 100, status: 'live',   hd: true, bitrate: 128 },
  { id: 's012', name: 'KCSM Jazz',             call: 'KCSM', band: 'FM',  freq: 91.1,    city: 'San Mateo',   country: 'US', category: 'Jazz',        listeners: 3100,  hue: 65,  status: 'live',   hd: false, bitrate: 96 },
];

export const reports: Report[] = [
  { id: 'r41', stationId: 's009', station: 'Rinse FM',            kind: 'Broken stream',  reporter: 'mira@mira.dev',      ago: '12m', count: 14, status: 'open'    },
  { id: 'r40', stationId: 's003', station: 'BBC Radio 6',         kind: 'Mislabeled',     reporter: 'olu@ali.yu',         ago: '1h',  count: 3,  status: 'open'    },
  { id: 'r39', stationId: 's007', station: 'FIP',                 kind: 'Wrong genre',    reporter: 'anon',               ago: '2h',  count: 2,  status: 'open'    },
  { id: 'r38', stationId: 's010', station: 'NTS Radio 1',         kind: 'Geo-blocked',    reporter: 'dpark@park.io',      ago: '4h',  count: 9,  status: 'open'    },
  { id: 'r37', stationId: 's008', station: 'WWOZ New Orleans',    kind: 'Stale metadata', reporter: 'system',             ago: '6h',  count: 1,  status: 'review'  },
  { id: 'r36', stationId: 's002', station: 'WFMU',                kind: 'Abuse',          reporter: 'hana@example.com',   ago: '1d',  count: 1,  status: 'resolved'},
  { id: 'r35', stationId: 's006', station: 'KCRW Eclectic',       kind: 'Broken stream',  reporter: 'system',             ago: '1d',  count: 4,  status: 'resolved'},
];

export const podcasts: Podcast[] = [
  { id: 'p1', title: 'The Daily',                publisher: 'NYT',         category: 'News',       episodes: 1820, downloads: 482000, status: 'live'  },
  { id: 'p2', title: 'Reply All Archive',         publisher: 'Gimlet',      category: 'Tech',       episodes:  187, downloads:  98400, status: 'live'  },
  { id: 'p3', title: '99% Invisible',             publisher: 'SiriusXM',    category: 'Design',     episodes:  580, downloads: 122000, status: 'live'  },
  { id: 'p4', title: 'Song Exploder',             publisher: 'Radiotopia',  category: 'Music',      episodes:  290, downloads:  64000, status: 'live'  },
  { id: 'p5', title: 'Hardcore History',          publisher: 'Dan Carlin',  category: 'History',    episodes:   75, downloads:  88000, status: 'draft' },
  { id: 'p6', title: "Conan O'Brien Needs a Friend", publisher: 'Team Coco', category: 'Comedy',   episodes:  330, downloads:  47000, status: 'live'  },
];

export const books: Audiobook[] = [
  { id: 'b1', title: 'Project Hail Mary',        author: 'Andy Weir',      narrator: 'Ray Porter',   genre: 'Sci-Fi',   chapters: 32, hours: 16.1, owned: 4820 },
  { id: 'b2', title: 'Dune',                     author: 'Frank Herbert',  narrator: 'Scott Brick',  genre: 'Sci-Fi',   chapters: 48, hours: 21.0, owned: 6210 },
  { id: 'b3', title: 'The Body Keeps the Score', author: 'Bessel van der Kolk', narrator: 'Sean Pratt', genre: 'Health', chapters: 21, hours: 16.8, owned: 3400 },
  { id: 'b4', title: 'Pachinko',                 author: 'Min Jin Lee',    narrator: 'Allison Hiroto',genre: 'Fiction',chapters: 27, hours: 18.2, owned: 2810 },
  { id: 'b5', title: 'Sapiens',                  author: 'Yuval Harari',   narrator: 'Derek Perkins',genre: 'History', chapters: 20, hours: 15.3, owned: 5180 },
];

export const users: OCUser[] = [
  { id: 'u8a4f', name: 'Aki Kobayashi',  email: 'aki@ondacast.com',   role: 'admin',  plan: 'team',  status: 'active',    last: '4m ago',  signed: 'Jan 12, 2025', hue: 30,  passkey: true,  sessions: 3 },
  { id: 'ub211', name: 'Lin Sato',       email: 'lin@ondacast.com',   role: 'staff',  plan: 'team',  status: 'active',    last: '12m ago', signed: 'Nov 3, 2024',  hue: 200, passkey: true,  sessions: 2 },
  { id: 'uc903', name: 'Hana Tanaka',    email: 'hana@example.com',   role: 'user',   plan: 'plus',  status: 'active',    last: '1h ago',  signed: 'Mar 8, 2025',  hue: 145, passkey: true,  sessions: 1 },
  { id: 'ud544', name: 'Mira Patel',     email: 'mira@mira.dev',      role: 'user',   plan: 'plus',  status: 'active',    last: '2h ago',  signed: 'Apr 22, 2025', hue: 320, passkey: false, sessions: 2 },
  { id: 'ue102', name: 'Theo Schultz',   email: 'theo@inboxone.io',   role: 'user',   plan: 'free',  status: 'pending',   last: 'Never',   signed: 'May 4, 2026',  hue: 260, passkey: false, sessions: 0 },
  { id: 'uf771', name: 'Yulia Demidova', email: 'yulia@demid.ru',     role: 'user',   plan: 'plus',  status: 'active',    last: '3h ago',  signed: 'Jul 19, 2025', hue: 100, passkey: true,  sessions: 1 },
  { id: 'ug099', name: 'Sam Olsen',      email: 'sam@olsen.co',       role: 'user',   plan: 'free',  status: 'suspended', last: '12d ago', signed: 'Feb 1, 2025',  hue: 25,  passkey: false, sessions: 0 },
  { id: 'uh884', name: 'Priya Iyer',     email: 'priya@iyer.dev',     role: 'staff',  plan: 'team',  status: 'active',    last: '5m ago',  signed: 'Sep 14, 2024', hue: 220, passkey: true,  sessions: 4 },
];

export const plans: Plan[] = [
  { id: 'free',  name: 'Free',  price: 0,    period: 'mo', trial: 0,  audience: 'Casual',            features: ['Live FM/AM/Web radio', 'Limited geo discovery', 'Ads between stations', '1 device at a time'] },
  { id: 'plus',  name: 'Plus',  price: 4.99, period: 'mo', trial: 14, audience: 'Daily listener',      featured: true, features: ['Everything in Free', 'Ad-free', 'HD subchannels', 'Offline podcasts', '3 devices'] },
  { id: 'team',  name: 'Team',  price: 12.0, period: 'mo', trial: 14, audience: 'Households / studios', features: ['Everything in Plus', '5 seats', 'Shared favorites', 'Family DJ mode', 'Lossless when available'] },
];

export const payments: Payment[] = [
  { id: 'pi_902af', user: 'lin@ondacast.com',   amount: 12.00,  plan: 'Team',  method: '•• 4242', status: 'succeeded', at: 'May 10, 14:22' },
  { id: 'pi_902ae', user: 'mira@mira.dev',      amount:  4.99,  plan: 'Plus',  method: '•• 1881', status: 'succeeded', at: 'May 10, 09:08' },
  { id: 'pi_902ad', user: 'hana@example.com',   amount:  4.99,  plan: 'Plus',  method: 'Apple',   status: 'succeeded', at: 'May 9,  21:14' },
  { id: 'pi_902ac', user: 'olu@ali.yu',         amount:  4.99,  plan: 'Plus',  method: '•• 5547', status: 'refunded',  at: 'May 9,  18:50' },
  { id: 'pi_902ab', user: 'yulia@demid.ru',     amount:  4.99,  plan: 'Plus',  method: '•• 3097', status: 'succeeded', at: 'May 9,  11:02' },
  { id: 'pi_902aa', user: 'dpark@park.io',      amount: 12.00,  plan: 'Team',  method: 'PayPal',  status: 'failed',    at: 'May 9,  10:34' },
  { id: 'pi_9029f', user: 'sam@olsen.co',       amount:  4.99,  plan: 'Plus',  method: '•• 4242', status: 'succeeded', at: 'May 8,  19:00' },
];

export const coupons: Coupon[] = [
  { code: 'LAUNCH50',  desc: '50% off first 3 months',     redeems: 482, cap: 2000, plans: ['plus','team'], status: 'active',   ends: 'Jun 1' },
  { code: 'PODFAM',    desc: '30% off Team',               redeems:  41, cap:  500, plans: ['team'],         status: 'active',   ends: 'Aug 14' },
  { code: 'GIFT-2025', desc: '1 month Plus on the house',  redeems: 110, cap:  null, plans: ['plus'],        status: 'active',   ends: 'Dec 31' },
  { code: 'OLDFRIEND', desc: '20% off forever',            redeems:  62, cap:  100, plans: ['plus','team'], status: 'archived', ends: '\u2014' },
];

export const subscriptions: OCSubscription[] = [
  { id: 'sub_8a4f', user: 'aki@ondacast.com',   plan: 'Team', status: 'active',   started: 'Jun 1' },
  { id: 'sub_b211', user: 'lin@ondacast.com',   plan: 'Team', status: 'active',   started: 'Jun 1' },
  { id: 'sub_c903', user: 'hana@example.com',   plan: 'Plus', status: 'active',   started: 'Jun 15' },
  { id: 'sub_d544', user: 'mira@mira.dev',      plan: 'Plus', status: 'active',   started: 'Dec 1' },
  { id: 'sub_f771', user: 'yulia@demid.ru',     plan: 'Plus', status: 'trialing', started: 'May 20' },
  { id: 'sub_g099', user: 'sam@olsen.co',       plan: 'Plus', status: 'past_due', started: 'May 8' },
  { id: 'sub_h884', user: 'priya@iyer.dev',     plan: 'Team', status: 'active',   started: 'Jun 1' },
];

export const pages: PageItem[] = [
  { id: 'about',   title: 'About',            slug: '/about',            updated: 'May 7',  status: 'published' },
  { id: 'help',    title: 'Help Center',      slug: '/help',             updated: 'Apr 22', status: 'published' },
  { id: 'terms',   title: 'Terms of Service', slug: '/terms',            updated: 'Apr 30', status: 'published' },
  { id: 'privacy', title: 'Privacy Policy',   slug: '/privacy',          updated: 'Apr 30', status: 'published' },
  { id: 'dmca',    title: 'DMCA',             slug: '/legal/dmca',       updated: 'Apr 15', status: 'published' },
  { id: 'contact', title: 'Contact',          slug: '/contact',          updated: 'Mar 10', status: 'published' },
  { id: 'press',   title: 'Press Kit',        slug: '/press',            updated: '\u2014',   status: 'draft' },
];

export const blogPosts: BlogPost[] = [
  { id: 'b07', title: 'Spring update: HD subchannels, native passkeys, and a new audiobook engine', author: 'lin', status: 'published', date: 'May 4',  tags: ['release','engineering'] },
  { id: 'b06', title: 'How OndaCast handles offline podcasts on iOS without bloating storage',     author: 'aki', status: 'published', date: 'Apr 28', tags: ['engineering','mobile'] },
  { id: 'b05', title: 'Why we chose radio-browser.info \u2014 and where we go next',               author: 'lin', status: 'published', date: 'Apr 14', tags: ['data'] },
  { id: 'b04', title: 'A short history of the OndaCast tuner UI',                                 author: 'aki', status: 'published', date: 'Mar 30', tags: ['design'] },
  { id: 'b03', title: 'M5 milestone: chassis chrome lands',                                       author: 'lin', status: 'draft',     date: '\u2014',tags: ['release'] },
];

export const auditLog: AuditEntry[] = [
  { who: 'aki@ondacast.com', icon: 'shield', color: 'green',  what: 'approved HD subchannel KEXP-HD2',                            ago: '4m'  },
  { who: 'system',           icon: 'warn',   color: 'red',    what: 'stream s009 (Rinse FM) returned 502 \u2014 flagged offline',  ago: '12m' },
  { who: 'lin@ondacast.com', icon: 'key',    color: 'blue',   what: 'rotated SMTP credentials (mailgun)',                          ago: '38m' },
  { who: 'aki@ondacast.com', icon: 'edit',   color: 'amber',  what: 'updated Plus plan price from $3.99 to $4.99',                 ago: '1h'  },
  { who: 'system',           icon: 'users',  color: 'blue',   what: '12 new signups in last hour',                                  ago: '1h'  },
  { who: 'aki@ondacast.com', icon: 'flag',   color: 'red',    what: 'resolved 3 reports for BBC Radio 6 (mislabeled)',              ago: '2h'  },
  { who: 'lin@ondacast.com', icon: 'cog',    color: 'amber',  what: 'enabled feature flag audiobook_v2_engine at 25%',              ago: '3h'  },
  { who: 'system',           icon: 'cloud',  color: 'blue',   what: 'nightly backup completed (2.4 GB) \u2192 r2://ondacast-backups', ago: '8h' },
  { who: 'aki@ondacast.com', icon: 'tag',    color: 'amber',  what: 'added genre "Lo-fi" + assigned to 14 stations',                ago: '12h' },
  { who: 'lin@ondacast.com', icon: 'webhook',color: 'purple', what: 'added webhook \u2192 https://hooks.slack.com/services/T0\u2026',  ago: '1d' },
];

export const themes: ThemeItem[] = [
  { id: 'walnut',  name: 'Walnut',   colors: ['#1a140e','#3a2510','#ffb454','#f3ecdb'], active: true,  builtin: true  },
  { id: 'midnight',name: 'Midnight', colors: ['#0a0e1a','#1a2238','#5fb4e6','#e6edf7'], active: false, builtin: true  },
  { id: 'vinyl',   name: 'Vinyl',    colors: ['#1a0e0e','#3a1818','#e55a4a','#f7e6e6'], active: false, builtin: true  },
  { id: 'moss',    name: 'Moss',     colors: ['#0e1a10','#1a3820','#6fcf6f','#e6f3e8'], active: false, builtin: false },
  { id: 'cobalt',  name: 'Cobalt',   colors: ['#0e0e1a','#1c1c40','#b794e6','#ece6f7'], active: false, builtin: false },
];

export const flags: FeatureFlag[] = [
  { key: 'audiobook_v2_engine',   on: true,  rollout: 25, env: 'prod' },
  { key: 'passkey_signup',        on: true,  rollout: 100, env: 'prod' },
  { key: 'hd_subchannels_v2',     on: true,  rollout: 50, env: 'prod' },
  { key: 'background_play_ios',   on: true,  rollout: 100, env: 'prod' },
  { key: 'spectrum_visualizer',   on: false, rollout: 0,  env: 'prod' },
  { key: 'ai_chapter_summary',    on: true,  rollout: 5,  env: 'staging' },
];

export const apiKeys: APIKeyItem[] = [
  { id: 'ok_live_a3c', name: 'Marketing site (SSR)', key: 'ok_live_a3c\u2026f12d', created: 'Jan 5, 2025',  last: '2m ago' },
  { id: 'ok_live_b7e', name: 'Mobile shells',        key: 'ok_live_b7e\u20261a90', created: 'Feb 2, 2025',  last: 'now' },
  { id: 'ok_live_4dd', name: 'Studio integration',   key: 'ok_live_4dd\u2026ff21', created: 'Apr 14, 2025', last: '1h ago' },
  { id: 'ok_live_999', name: 'Stripe webhook signer',key: 'ok_live_999\u2026aaab', created: 'Mar 11, 2025', last: '9m ago' },
];

export const webhooks: WebhookItem[] = [
  { id: 'wh1', url: 'https://stripe-listener.ondacast.com/wh',  events: ['billing.*'],                       status: 'active',   last: '1m ago' },
  { id: 'wh2', url: 'https://discord.com/api/webhooks/123/abc',  events: ['report.created'],                  status: 'active',   last: '3m ago' },
  { id: 'wh3', url: 'https://eo-analytics.com/wh/oc',            events: ['user.signup', 'sub.created'],       status: 'active',   last: '12m ago' },
  { id: 'wh4', url: 'https://radio-browser.info/cb',             events: ['station.create', 'station.update'], status: 'inactive', last: '\u2014' },
];

export const sessionList: SessionItem[] = [
  { id: 's1', user: 'aki@ondacast.com',  device: 'MacBook Air \u00b7 Safari 18',     ip: '203.0.113.41',  started: '08:14',     auth: 'passkey' },
  { id: 's2', user: 'aki@ondacast.com',  device: 'iPhone 15 \u00b7 OndaCast iOS 0.4',ip: '203.0.113.41',  started: 'Yesterday',  auth: 'passkey' },
  { id: 's3', user: 'aki@ondacast.com',  device: 'iPad \u00b7 Safari',                ip: '70.92.18.4',    started: 'May 8',      auth: 'magic' },
  { id: 's4', user: 'lin@ondacast.com',  device: 'Linux \u00b7 Firefox 130',          ip: '62.18.244.7',   started: '07:02',      auth: 'passkey' },
  { id: 's5', user: 'lin@ondacast.com',  device: 'Pixel 8 \u00b7 OndaCast Android 0.4',ip: '62.18.244.7',  started: 'May 9',      auth: 'passkey' },
  { id: 's6', user: 'priya@iyer.dev',    device: 'Windows \u00b7 Chrome 124',         ip: '104.244.42.193',started: '06:55',      auth: 'magic' },
];

export const inviteList: InviteItem[] = [
  { id: 'inv1', email: 'theo@inboxone.io',     role: 'user',  sent: 'May 4',  status: 'pending' },
  { id: 'inv2', email: 'esther@thr.app',       role: 'user',  sent: 'May 4',  status: 'pending' },
  { id: 'inv3', email: 'support@ondacast.com', role: 'staff', sent: 'Apr 28', status: 'accepted' },
  { id: 'inv4', email: 'spam@example.com',     role: 'user',  sent: 'Apr 12', status: 'expired' },
];
