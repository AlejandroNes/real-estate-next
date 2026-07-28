import { createClient } from './browser-client';
import { createAdminClient } from './admin-client';

/**
 * Upload a property image from the browser (uses anon key via browser client).
 * The storage bucket must have an RLS policy allowing authenticated uploads.
 */
export async function uploadPropertyImage(file: File): Promise<{ url: string | null; error: string | null }> {
  try {
    const supabase = createClient();

    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `properties/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('property-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return { url: null, error: uploadError.message };
    }

    const { data } = supabase.storage
      .from('property-images')
      .getPublicUrl(filePath);

    return { url: data.publicUrl, error: null };
  } catch (err: any) {
    console.error('Exception uploading image:', err);
    return { url: null, error: err.message };
  }
}
