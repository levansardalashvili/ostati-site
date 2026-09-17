import {
  Armchair,
  CheckCircle,
  Clock,
  DoorOpen,
  FileText,
  Flame,
  Grid2X2,
  Hammer,
  House,
  LockKeyhole,
  MessageCircle,
  Package,
  Paintbrush,
  PanelsTopLeft,
  PlugZap,
  ScanSearch,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Star,
  Tags,
  ThumbsUp,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';

// Must match `site_blocks_icon_key_check` in ostati-app's
// supabase/migrations/0074_site_blocks.sql exactly — a superset of
// categories' icon set (categoryIcons.ts) plus a few marketing-specific
// icons. Kept as its own file/map rather than merged with
// categoryIcons.ts since each mirrors a DIFFERENT DB CHECK constraint —
// conflating them would make it unclear which table actually allows
// which icon_key values.
const ICON_MAP: Record<string, LucideIcon> = {
  Wrench,
  Zap,
  Paintbrush,
  Snowflake,
  Flame,
  Armchair,
  PlugZap,
  Grid2X2,
  PanelsTopLeft,
  DoorOpen,
  LockKeyhole,
  Hammer,
  House,
  Sparkles,
  Package,
  ShieldCheck,
  MessageCircle,
  Tags,
  ScanSearch,
  FileText,
  ThumbsUp,
  Star,
  CheckCircle,
  Users,
  Clock,
};

export function getBlockIcon(iconKey: string): LucideIcon {
  return ICON_MAP[iconKey] ?? Star;
}
