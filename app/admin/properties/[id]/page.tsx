import PropertyForm from '@/components/admin/PropertyForm';
import { getPropertyById } from '@/lib/supabase/properties';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Edit Property | Admin',
};

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  return (
    <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PropertyForm initialData={property} isEdit={true} />
    </main>
  );
}
