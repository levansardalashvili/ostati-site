// ადმინის სესიის cookie:
//  - httpOnly: JavaScript-ს (მათ შორის ჩაგდებულ ბოროტ სკრიპტს) სესიის token-ის წაკითხვა არ შეუძლია
//  - secure (production): მხოლოდ HTTPS-ით
//  - sameSite lax: სხვა საიტიდან გაგზავნილ ფორმას cookie არ ახლავს
//  - maxAge 12 საათი: გატაცებული/მიტოვებული ბრაუზერი ხანგრძლივად ადმინად არ რჩება (ნაგულისხმევი იყო 400 დღე)
// ბრაუზერული Supabase კლიენტი ამ საიტს არ სჭირდება — ყველა მოთხოვნა სერვერიდან (server actions/RSC) მიდის.
export const ADMIN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 12,
  path: '/',
};
