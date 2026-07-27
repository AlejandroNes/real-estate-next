'use server';

import { updateUserRole, UserRole } from '@/lib/supabase/roles';
import { supabase } from '@/lib/supabase/client';
import { revalidatePath } from 'next/cache';

export async function updateUserRoleAction(userId: string, email: string, role: UserRole) {
  const result = await updateUserRole(userId, email, role);
  revalidatePath('/admin');
  return result;
}

export async function togglePropertyFeaturedAction(propertyId: string, currentFeaturedState: boolean) {
  try {
    const { error } = await supabase
      .from('properties')
      .update({ is_featured: !currentFeaturedState })
      .eq('id', propertyId);

    if (error) {
      console.error('[togglePropertyFeaturedAction] Error:', error.message);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true, newFeaturedState: !currentFeaturedState };
  } catch (err: any) {
    console.error('[togglePropertyFeaturedAction] Exception:', err.message);
    return { success: false, error: err.message };
  }
}
