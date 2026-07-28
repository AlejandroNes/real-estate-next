import PropertyForm from '@/components/admin/PropertyForm';

export const metadata = {
  title: 'Add New Property | Admin',
};

export default function NewPropertyPage() {
  return (
    <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PropertyForm />
    </main>
  );
}
