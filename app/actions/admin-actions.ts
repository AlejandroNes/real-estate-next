'use server';

import { updateUserRole, UserRole } from '@/lib/supabase/roles';
import { createAdminClient } from '@/lib/supabase/admin-client';
import { revalidatePath } from 'next/cache';

export async function updateUserRoleAction(userId: string, email: string, role: UserRole) {
  const result = await updateUserRole(userId, email, role);
  revalidatePath('/admin');
  return result;
}

export async function togglePropertyFeaturedAction(propertyId: string, currentFeaturedState: boolean) {
  try {
    const supabase = createAdminClient();
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

export async function togglePropertyActiveAction(propertyId: string, currentActiveState: boolean) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from('properties')
      .update({ is_active: !currentActiveState })
      .eq('id', propertyId);

    if (error) {
      console.error('[togglePropertyActiveAction] Error:', error.message);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/properties');
    revalidatePath('/properties');
    revalidatePath('/');
    return { success: true, newActiveState: !currentActiveState };
  } catch (err: any) {
    console.error('[togglePropertyActiveAction] Exception:', err.message);
    return { success: false, error: err.message };
  }
}

export async function savePropertyAction(propertyData: any, isEdit: boolean, additionalImageUrls: string[] = []) {
  try {
    const supabase = createAdminClient();
    const propertyId = isEdit ? propertyData.id : crypto.randomUUID();
    
    // Convert camelCase to snake_case for DB
    const row = {
      id: propertyId,
      title: propertyData.title,
      location: propertyData.location || '',
      price: propertyData.price,
      price_suffix: propertyData.priceSuffix || null,
      beds: Number(propertyData.beds) || 0,
      baths: Number(propertyData.baths) || 0,
      area: propertyData.area || '0',
      badge: propertyData.badge || 'New',
      badge_type: propertyData.badgeType || 'primary',
      image_url: propertyData.imageUrl || '',
      is_featured: propertyData.isFeatured || false,
      is_active: propertyData.isActive !== undefined ? propertyData.isActive : true,
      transaction_type: propertyData.transactionType || 'buy',
      slug: propertyData.slug || propertyData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      lat: Number(propertyData.lat) || 0,
      lng: Number(propertyData.lng) || 0,
      description: propertyData.description || null,
      property_type: propertyData.propertyType || null,
      status: propertyData.status || null,
      year_built: propertyData.yearBuilt ? Number(propertyData.yearBuilt) : null,
      amenities: propertyData.amenities || []
    };

    let result;
    if (isEdit) {
      result = await supabase.from('properties').update(row).eq('id', propertyId);
    } else {
      result = await supabase.from('properties').insert([row]);
    }

    if (result.error) {
      console.error('[savePropertyAction] Error:', result.error.message);
      return { success: false, error: result.error.message };
    }

    // Delete old secondary images if editing
    if (isEdit) {
      const { error: delError } = await supabase
        .from('property_images')
        .delete()
        .eq('property_id', propertyId);
      if (delError) {
        console.warn('[savePropertyAction] Delete old images warning:', delError.message);
      }
    }

    // Save additional images to property_images table
    if (additionalImageUrls.length > 0) {
      const imageRows = additionalImageUrls.map((url, i) => ({
        id: crypto.randomUUID(),
        property_id: propertyId,
        url,
        alt_text: `${propertyData.title} - Image ${i + 2}`,
        is_primary: false,
      }));

      const { error: imgError } = await supabase.from('property_images').insert(imageRows);
      if (imgError) {
        console.error('[savePropertyAction] Image save error:', imgError.message);
      }
    }

    revalidatePath('/admin/properties');
    revalidatePath('/properties');
    revalidatePath('/');
    return { success: true, id: propertyId };
  } catch (err: any) {
    console.error('[savePropertyAction] Exception:', err.message);
    return { success: false, error: err.message };
  }
}
