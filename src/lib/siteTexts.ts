// საიტის ყველა რედაქტირებადი ტექსტი/პარამეტრი ერთ ადგილას: გასაღები, ლეიბლი ადმინისთვის, ნაგულისხმევი. საჯარო საიტი
// (text()) და ადმინის ფორმა ერთსა და იმავე სიას იყენებს — ახალი ტექსტის დასამატებლად საკმარისია აქ ერთი ჩანაწერი
// (ბაზაში ჩანაწერი არ სჭირდება: არარსებულ გასაღებზე ნაგულისხმევი ჩანს, ადმინიდან პირველ შენახვაზე ჩაიწერება).

export type SiteTextDef = {
  key: string;
  label: string;
  group: string;
  default: string;
  multiline?: boolean;
  placeholder?: string;
  // true — ცარიელი მნიშვნელობა განზრახ დასაშვებია (ტექსტი/ბმული იმალება); false — ცარიელი = ნაგულისხმევი
  allowEmpty?: boolean;
  hint?: string;
};

export const SITE_TEXTS: SiteTextDef[] = [
  // ბმულები და კონტაქტი
  { key: 'play_store_url', label: 'Google Play ბმული', group: 'ბმულები და კონტაქტი', default: '', allowEmpty: true, placeholder: 'https://play.google.com/store/apps/details?id=...' },
  { key: 'app_store_url', label: 'App Store ბმული', group: 'ბმულები და კონტაქტი', default: '', allowEmpty: true, placeholder: 'https://apps.apple.com/app/...' },
  { key: 'contact_email', label: 'საკონტაქტო ელფოსტა', group: 'ბმულები და კონტაქტი', default: '', allowEmpty: true, placeholder: 'info@ostato.app', hint: 'ჩანს ფუტერში და გვერდებში, სადაც {{contact_email}} წერია' },

  // ზოგადი
  { key: 'site_name', label: 'საიტის სახელი (ლოგო, ბრაუზერის სათაური)', group: 'ზოგადი', default: 'Ostato' },
  { key: 'site_description', label: 'საიტის აღწერა (Google-ისთვის)', group: 'ზოგადი', default: 'Ostato აკავშირებს მომხმარებლებს ადგილობრივ ოსტატებთან.', multiline: true },
  { key: 'header_cta', label: 'ჰედერის ღილაკი', group: 'ზოგადი', default: 'გადმოწერე' },
  { key: 'footer_tagline', label: 'ფუტერის მოკლე აღწერა', group: 'ზოგადი', default: 'Ostato აკავშირებს მომხმარებლებს სანდო, ადგილობრივ ოსტატებთან — სანტექნიკოსი, ელექტრიკოსი და სხვა.', multiline: true, allowEmpty: true },
  { key: 'copyright_text', label: 'ფუტერის ქვედა ტექსტი', group: 'ზოგადი', default: 'ყველა უფლება დაცულია.', hint: 'წინ ავტომატურად ემატება © წელი და საიტის სახელი' },

  // მთავარი გვერდი
  { key: 'hero_note', label: 'შენიშვნა store-ღილაკების ქვეშ', group: 'მთავარი გვერდი', default: 'უფასოა · iOS და Android', allowEmpty: true },
  { key: 'home_services_eyebrow', label: 'სერვისების ბლოკი — პატარა სათაური', group: 'მთავარი გვერდი', default: 'სერვისები' },
  { key: 'home_services_title', label: 'სერვისების ბლოკი — სათაური', group: 'მთავარი გვერდი', default: 'სახლის ნებისმიერი სამუშაო — ერთ აპში' },
  { key: 'home_services_link', label: 'სერვისების ბლოკი — ბმულის ტექსტი', group: 'მთავარი გვერდი', default: 'ყველა სერვისი' },
  { key: 'home_features_eyebrow', label: 'უპირატესობების ბლოკი — პატარა სათაური', group: 'მთავარი გვერდი', default: 'რატომ Ostato' },
  { key: 'home_features_title', label: 'უპირატესობების ბლოკი — სათაური', group: 'მთავარი გვერდი', default: 'სანდო, გამჭვირვალე და მარტივი' },
  { key: 'home_steps_eyebrow', label: 'ნაბიჯების ბლოკი — პატარა სათაური', group: 'მთავარი გვერდი', default: 'ნაბიჯები' },
  { key: 'home_steps_title', label: 'ნაბიჯების ბლოკი — სათაური', group: 'მთავარი გვერდი', default: 'როგორ მუშაობს' },
  { key: 'home_steps_link', label: 'ნაბიჯების ბლოკი — ბმულის ტექსტი', group: 'მთავარი გვერდი', default: 'დეტალურად' },
  { key: 'home_providers_eyebrow', label: '„ოსტატებისთვის“ ბლოკი — პატარა სათაური', group: 'მთავარი გვერდი', default: 'ოსტატებისთვის' },

  // სერვისები
  { key: 'services_title', label: 'გვერდის სათაური', group: 'სერვისების გვერდი', default: 'სერვისები' },
  { key: 'services_intro', label: 'შესავალი ტექსტი', group: 'სერვისების გვერდი', default: 'Ostato-ზე იპოვი ოსტატს ნებისმიერი სახლის სამუშაოსთვის — {{categories}} კატეგორია.', multiline: true, hint: '{{categories}} იცვლება აქტიური კატეგორიების რაოდენობით' },

  // როგორ მუშაობს
  { key: 'hiw_cta_title', label: 'ქვედა ბლოკის სათაური', group: '„როგორ მუშაობს“ გვერდი', default: 'მზად ხარ დაიწყო?' },
];

export const SITE_TEXT_KEYS = SITE_TEXTS.map((t) => t.key);

// ბაზიდან წაკითხული settings + ნაგულისხმევი: ცარიელი მნიშვნელობა → ნაგულისხმევი (allowEmpty-ის გარდა)
export function text(settings: Record<string, string>, key: string): string {
  const def = SITE_TEXTS.find((t) => t.key === key);
  const value = settings[key];
  if (value === undefined) return def?.default ?? '';
  if (value === '' && !def?.allowEmpty) return def?.default ?? '';
  return value;
}
