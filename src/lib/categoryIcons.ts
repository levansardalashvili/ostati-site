import {
  Armchair,
  DoorOpen,
  Flame,
  Grid2X2,
  Hammer,
  House,
  LockKeyhole,
  Package,
  Paintbrush,
  PanelsTopLeft,
  PlugZap,
  Snowflake,
  Sparkles,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';

// Must match `categories_icon_key_check` in ostati-app's
// supabase/migrations/0043_categories.sql exactly — same bundled Lucide
// names the mobile app's CategoryIcon.tsx maps against.
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
};

export function getCategoryIcon(iconKey: string): LucideIcon {
  return ICON_MAP[iconKey] ?? Wrench;
}
