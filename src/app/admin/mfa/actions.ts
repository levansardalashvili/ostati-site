'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-admin/server';

export type EnrollStart = { error?: string; factorId?: string; qr?: string; secret?: string };

// ახალი TOTP ფაქტორის დაწყება. წინა, ბოლომდე მიუყვანელი (unverified) ფაქტორები იწმინდება, რომ სია არ დაიბინძუროს.
// დადასტურებული ფაქტორის მქონე ადმინს (aal2-ზე) ახალი მოწყობილობის დამატება შეუძლია; aal1-ზე — არა (middleware + Supabase).
export async function startEnroll(): Promise<EnrollStart> {
  const supabase = await createClient();
  const { data: factors } = await supabase.auth.mfa.listFactors();
  for (const f of factors?.all ?? []) {
    if (f.status === 'unverified') await supabase.auth.mfa.unenroll({ factorId: f.id });
  }
  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: 'totp',
    issuer: 'Ostati Admin',
    friendlyName: `Ostati ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`,
  });
  if (error || !data) return { error: 'ვერ დაიწყო. სცადეთ ხელახლა.' };
  return { factorId: data.id, qr: data.totp.qr_code, secret: data.totp.secret };
}

async function challengeAndVerify(factorId: string, code: string): Promise<string | undefined> {
  const clean = code.replace(/\s/g, '');
  if (!/^\d{6}$/.test(clean)) return 'შეიყვანეთ 6-ციფრიანი კოდი';
  const supabase = await createClient();
  const ch = await supabase.auth.mfa.challenge({ factorId });
  if (ch.error || !ch.data) return 'ვერ შემოწმდა. სცადეთ ხელახლა.';
  const v = await supabase.auth.mfa.verify({ factorId, challengeId: ch.data.id, code: clean });
  if (v.error) { console.error('MFA verify failed:', v.error.status, v.error.code, v.error.message); return 'კოდი არასწორია ან ვადა გაუვიდა'; }
  return undefined;
}

// რეგისტრაციის დასრულება: პირველი კოდი ადასტურებს, რომ აპი სწორად არის მიბმული
export async function confirmEnroll(factorId: string, code: string): Promise<{ error?: string }> {
  const err = await challengeAndVerify(factorId, code);
  if (err) return { error: err };
  redirect('/admin');
}

// ყოველი შესვლისას: პაროლის შემდეგ TOTP კოდი
export async function verifyLogin(_prev: { error?: string }, formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data } = await supabase.auth.mfa.listFactors();
  const factor = data?.totp?.[0]; // totp = მხოლოდ დადასტურებული TOTP ფაქტორები
  if (!factor) redirect('/admin/mfa/setup');
  const err = await challengeAndVerify(factor.id, String(formData.get('code') ?? ''));
  if (err) return { error: err };
  redirect('/admin');
}
