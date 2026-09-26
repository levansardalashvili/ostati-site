// ბმულები/ელფოსტა, რომელიც ადმინის პარამეტრებიდან (site_settings) მოდის, href-ში მხოლოდ შემოწმებული სახით ხვდება —
// `javascript:` და მსგავსი სქემა ვერასოდეს გახდება დაჭერადი ბმული.
export function safeHttpUrl(v?: string | null): string | undefined {
  const s = v?.trim();
  return s && /^https?:\/\/[^\s"'<>]+$/i.test(s) ? s : undefined;
}

export function safeEmail(v?: string | null): string | undefined {
  const s = v?.trim();
  return s && /^[^\s@<>"'()\[\],;:\\]+@[^\s@<>"'()\[\],;:\\]+\.[^\s@<>"'()\[\],;:\\]+$/.test(s) ? s : undefined;
}
