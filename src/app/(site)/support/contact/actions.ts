'use server';

import { supabase } from '@/lib/supabase';

export type ContactState = { ok?: boolean; error?: string };

// საიტზე ავტორიზაცია არ არის — ჩაწერა მხოლოდ anon-ისთვის ღია RPC-ით (0132): honeypot, ვალიდაცია და შეზღუდვა სერვერზეა
export async function submitSupportRequest(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const { error } = await supabase().rpc('submit_support_request', {
    p_name: String(formData.get('name') ?? ''),
    p_contact: String(formData.get('contact') ?? ''),
    p_topic: String(formData.get('topic') ?? ''),
    p_message: String(formData.get('message') ?? ''),
    p_website: String(formData.get('website') ?? ''),
  });
  if (!error) return { ok: true };
  if (error.message.includes('RATE_LIMIT')) return { error: 'ძალიან ბევრი მიმართვაა გაგზავნილი. სცადეთ მოგვიანებით.' };
  if (error.message.includes('INVALID_REQUEST'))
    return { error: 'შეამოწმეთ ველები: საკონტაქტო მონაცემი უნდა იყოს ელფოსტა ან ტელეფონი, შეტყობინება — მინიმუმ 10 სიმბოლო.' };
  return { error: 'ვერ გაიგზავნა. სცადეთ ხელახლა.' };
}
