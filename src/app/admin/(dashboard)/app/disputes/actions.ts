'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase-admin/server';

export type ActionResult = { error?: string };

const RESOLUTIONS = ['reopen', 'cancel'] as const;

// Wraps ostati-app's admin_resolve_job_dispute() RPC
// (supabase/migrations/0078_admin_dispute_resolution.sql) — the only
// path out of job_posts.status='disputed'. 'reopen' sides with the
// Provider (back to awaiting_customer_confirmation, giving the Customer
// another confirm/dispute cycle); 'cancel' sides with the Customer
// (cancelled, stamping cancellation_actor='admin'). No direct table
// write here — the RPC re-validates status='disputed' and derives
// everything else server-side.
export async function resolveDispute(
  jobId: string,
  resolution: (typeof RESOLUTIONS)[number],
): Promise<ActionResult> {
  if (!RESOLUTIONS.includes(resolution)) {
    return { error: 'არასწორი გადაწყვეტა' };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc('admin_resolve_job_dispute', {
    p_job_id: jobId,
    p_resolution: resolution,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/app/disputes');
  return {};
}
