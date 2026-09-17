// Deliberately NOT `Intl`/`toLocaleString('ka-GE')` — Node's server runtime
// ships with limited ICU data (full Georgian locale support isn't
// guaranteed), while the browser has it, so the same call produces two
// different strings for the same Date depending on where it runs. In a
// Server Component that gets hydrated client-side, that mismatch is a
// real React hydration error (confirmed live in the admin panel:
// server "9/6/2026, 11:57:35 AM" vs client "6.9.2026, 11:57:35" for the
// exact same timestamp). Hand-rolled formatting is deterministic
// everywhere, since it never touches ICU/locale data at all.
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}.${month}.${year}, ${hours}:${minutes}`;
}
