'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase-admin/server';

export type ActionResult = { error?: string };

export async function addDistrict(regionId: string, regionLabel: string | null, district: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.rpc('admin_add_district', {
    p_region_id: regionId,
    p_region_label: regionLabel,
    p_district: district,
  });
  if (error) return { error: error.message };
  revalidatePath('/admin/app/regions');
  return {};
}

export async function setDistrictActive(id: string, active: boolean): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.rpc('admin_set_district_active', { p_id: id, p_active: active });
  if (error) return { error: error.message };
  revalidatePath('/admin/app/regions');
  return {};
}
