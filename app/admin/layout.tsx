import AdminNavbar from '@/components/AdminNavbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-nordic dark:text-gray-100 min-h-screen flex flex-col antialiased">
      <AdminNavbar />
      {children}
    </div>
  );
}
