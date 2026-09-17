// Must exactly match `categories_icon_key_check` in
// ostati-app/supabase/migrations/0043_categories.sql — the DB rejects any
// other value, since each name maps to a specific bundled Lucide
// component in the mobile app's CategoryIcon.tsx. Adding a new option
// here requires a matching client (ostati-app) release; this admin panel
// cannot make the app render an icon it doesn't already ship.
export const ICON_KEYS = [
  'Wrench',
  'Zap',
  'Paintbrush',
  'Snowflake',
  'Flame',
  'Armchair',
  'PlugZap',
  'Grid2X2',
  'PanelsTopLeft',
  'DoorOpen',
  'LockKeyhole',
  'Hammer',
  'House',
  'Sparkles',
  'Package',
] as const;

export type IconKey = (typeof ICON_KEYS)[number];
