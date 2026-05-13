declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

declare module 'lucide-svelte' {
  import type { SvelteComponent } from 'svelte';
  const icon: typeof SvelteComponent;
  export {
    icon as LayoutDashboard, icon as Radio, icon as RadioTower, icon as Monitor,
    icon as ClipboardList, icon as Flag, icon as Podcast, icon as BookOpen,
    icon as Music, icon as Tags, icon as Users, icon as ShieldCheck,
    icon as MonitorSmartphone, icon as Mail, icon as CreditCard, icon as Package,
    icon as DollarSign, icon as Ticket, icon as FileText, icon as FileEdit,
    icon as Menu, icon as Search, icon as HelpCircle, icon as Palette, icon as Image,
    icon as Megaphone, icon as Settings, icon as Shield, icon as Key, icon as Webhook,
    icon as Bell, icon as Globe, icon as Signal, icon as GitBranch, icon as Cloud,
    icon as FlaskConical, icon as Plus, icon as MoreHorizontal, icon as Filter,
    icon as Upload, icon as Download, icon as Edit, icon as Trash2, icon as Check,
    icon as X, icon as ChevronUp, icon as ChevronDown, icon as ChevronRight,
    icon as ExternalLink, icon as GripHorizontal, icon as Folder, icon as File,
    icon as Database, icon as MapPin, icon as RefreshCw, icon as Play,
    icon as StopCircle, icon as Copy, icon as Link, icon as Zap,
    icon as AlertTriangle, icon as Eye, icon as EyeOff, icon as Phone,
    icon as Hash, icon as SquareSlash, icon as Grip,
    icon as ArrowRight, icon as TrendingUp, icon as Gauge, icon as RadioTower,
    icon as DollarSign, icon as Users, icon as Signal, icon as Flag,
  };
}

export {};
