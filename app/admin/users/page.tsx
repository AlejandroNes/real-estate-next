'use client';

import { useState, useEffect } from 'react';
import { getAllUserRoles, UserRoleRecord, UserRole } from '@/lib/supabase/roles';
import { updateUserRoleAction } from '@/app/actions/admin-actions';
import { createClient } from '@/lib/supabase/browser-client';

export default function AdminUsersPage() {
  const [userRoles, setUserRoles] = useState<UserRoleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'agents' | 'admins'>('all');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Pagination State (6 items per page)
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Add user modal state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('agent');

  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      const rolesRes = await getAllUserRoles();

      if (user) {
        const { getUserRole } = await import('@/lib/supabase/roles');
        const userRole = await getUserRole(user.id);
        const exists = rolesRes.some(r => r.user_id === user.id || r.email === user.email);
        if (!exists) {
          rolesRes.unshift({
            id: `role-current-${Date.now()}`,
            user_id: user.id,
            email: user.email || 'authenticated@user.com',
            role: userRole,
            created_at: new Date().toISOString(),
          });
        }
      }

      setUserRoles(rolesRes);
      setLoading(false);
    }

    loadData();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSelectRole = async (record: UserRoleRecord, newRole: UserRole) => {
    setOpenDropdownId(null);
    setSavingUserId(record.user_id);

    // Optimistic state update
    setUserRoles(prev =>
      prev.map(u => (u.user_id === record.user_id ? { ...u, role: newRole } : u))
    );

    const res = await updateUserRoleAction(record.user_id, record.email, newRole);
    setSavingUserId(null);

    if (res.success) {
      showNotification(`Role for ${record.email} updated to ${newRole.toUpperCase()}`);
    } else {
      showNotification('Failed to update user role', 'error');
    }
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleTabChange = (tab: 'all' | 'agents' | 'admins') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail) return;

    const generatedUserId = `usr-${Date.now()}`;
    const newRecord: UserRoleRecord = {
      id: `role-${Date.now()}`,
      user_id: generatedUserId,
      email: newUserEmail,
      role: newUserRole,
      created_at: new Date().toISOString(),
    };

    setUserRoles(prev => [newRecord, ...prev]);
    await updateUserRoleAction(generatedUserId, newUserEmail, newUserRole);

    showNotification(`User ${newUserEmail} registered as ${newUserRole.toUpperCase()}`);
    setNewUserEmail('');
    setShowAddUserModal(false);
  };

  const filteredUsers = userRoles.filter(u => {
    const matchesSearch = u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'agents') return matchesSearch && (u.role === 'agent');
    if (activeTab === 'admins') return matchesSearch && (u.role === 'admin');
    return matchesSearch;
  });

  // Pagination logic
  const totalFiltered = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalFiltered);
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  return (
    <>
      {/* Header Section */}
      <header className="w-full pt-8 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Toast Notification */}
        {toast && (
          <div className="fixed top-20 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-semibold ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200 backdrop-blur-md'
                : 'bg-red-950/90 border-red-500/40 text-red-200 backdrop-blur-md'
            }`}>
              <span className="material-symbols-outlined text-xl">
                {toast.type === 'success' ? 'check_circle' : 'error'}
              </span>
              <span>{toast.message}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-nordic dark:text-white">User Directory</h1>
            <p className="text-nordic/60 dark:text-gray-400 mt-1 text-sm">Manage user access and roles for your properties.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative group w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-icons text-nordic/40 group-focus-within:text-primary text-xl">search</span>
              </div>
              <input
                type="text"
                placeholder="Search by name, email..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-white dark:bg-gray-800 text-nordic dark:text-white shadow-sm placeholder-nordic/30 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm"
              />
            </div>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="inline-flex items-center justify-center px-4 py-2.5 border border-primary text-sm font-medium rounded-lg text-primary bg-transparent hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors whitespace-nowrap"
            >
              <span className="material-icons text-lg mr-2">add</span>
              Add User
            </button>
          </div>
        </div>

        <div className="mt-8 flex gap-6 border-b border-nordic/10 overflow-x-auto">
          <button
            onClick={() => handleTabChange('all')}
            className={`pb-3 text-sm font-semibold transition-colors ${
              activeTab === 'all'
                ? 'text-primary border-b-2 border-primary'
                : 'text-nordic/60 hover:text-nordic'
            }`}
          >
            All Users ({userRoles.length})
          </button>
          <button
            onClick={() => handleTabChange('agents')}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === 'agents'
                ? 'text-primary border-b-2 border-primary'
                : 'text-nordic/60 hover:text-nordic'
            }`}
          >
            Agents ({userRoles.filter(u => u.role === 'agent').length})
          </button>
          <button
            onClick={() => handleTabChange('admins')}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === 'admins'
                ? 'text-primary border-b-2 border-primary'
                : 'text-nordic/60 hover:text-nordic'
            }`}
          >
            Admins ({userRoles.filter(u => u.role === 'admin').length})
          </button>
        </div>
      </header>

      {/* Main List */}
      <main className="flex-grow px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-12 space-y-4">
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 text-xs font-semibold uppercase tracking-wider text-nordic/50 mb-2">
          <div className="col-span-4">User Details</div>
          <div className="col-span-3">Role & Status</div>
          <div className="col-span-3">Performance / Access</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-nordic/60 dark:text-gray-400">
            <span className="material-icons animate-spin text-3xl text-primary mb-2">sync</span>
            <p className="text-sm font-medium">Loading user directory...</p>
          </div>
        ) : paginatedUsers.length === 0 ? (
          <div className="p-12 text-center text-nordic/60 dark:text-gray-400">
            <span className="material-icons text-4xl mb-2">no_accounts</span>
            <p className="text-sm font-medium">No users found matching filter.</p>
          </div>
        ) : (
          paginatedUsers.map((userRecord, index) => {
            const isDropdownOpen = openDropdownId === userRecord.user_id;

            return (
              <div
                key={userRecord.id || userRecord.user_id}
                className={`user-card group relative rounded-xl p-5 shadow-sm border transition-all flex flex-col md:grid md:grid-cols-12 gap-4 items-center ${
                  userRecord.role === 'admin'
                    ? 'bg-[#D9ECC8] dark:bg-primary/20 border-transparent hover:shadow-md'
                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:bg-[#D9ECC8]/50 dark:hover:bg-primary/20'
                }`}
                style={{ zIndex: paginatedUsers.length - index + 10 }}
              >
                {/* User Details */}
                <div className="col-span-12 md:col-span-4 flex items-center w-full">
                  <div className="relative flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-primary/10 text-primary dark:text-emerald-300 font-bold flex items-center justify-center text-base border-2 border-white dark:border-primary shadow-sm">
                      {userRecord.email.charAt(0).toUpperCase()}
                    </div>
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></span>
                  </div>
                  <div className="ml-4 overflow-hidden">
                    <div className="text-sm font-bold text-nordic dark:text-white truncate">
                      {userRecord.email.split('@')[0]}
                    </div>
                    <div className="text-xs text-nordic/70 dark:text-gray-300 truncate">
                      {userRecord.email}
                    </div>
                    <div className="mt-1 text-[10px] px-2 py-0.5 inline-block bg-white/60 dark:bg-white/10 rounded text-nordic/60 dark:text-gray-400 font-mono">
                      ID: #{userRecord.user_id.slice(0, 8)}
                    </div>
                  </div>
                </div>

                {/* Role & Status */}
                <div className="col-span-12 md:col-span-3 w-full flex items-center justify-between md:justify-start gap-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                      userRecord.role === 'admin'
                        ? 'bg-nordic text-white'
                        : userRecord.role === 'agent'
                        ? 'bg-primary/15 text-primary dark:text-emerald-300'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {userRecord.role === 'admin' ? 'Administrator' : userRecord.role === 'agent' ? 'Agent' : 'User (Client)'}
                  </span>

                  <div className="flex items-center text-xs text-nordic/70 dark:text-gray-400 font-medium">
                    <span className="material-icons text-[14px] mr-1 text-primary">check_circle</span>
                    Active
                  </div>
                </div>

                {/* Performance / Info */}
                <div className="col-span-12 md:col-span-3 w-full grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-nordic/50">Joined</div>
                    <div className="text-xs font-semibold text-nordic dark:text-white mt-0.5">
                      {userRecord.created_at ? new Date(userRecord.created_at).toLocaleDateString() : 'Recent'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-nordic/50">Access Level</div>
                    <div className="text-xs font-semibold text-nordic dark:text-white mt-0.5">
                      {userRecord.role === 'admin' ? 'Level 5 (Full)' : userRecord.role === 'agent' ? 'Level 3 (Agent)' : 'Level 1 (User)'}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="col-span-12 md:col-span-2 w-full flex justify-end relative">
                  <button
                    onClick={() => setOpenDropdownId(isDropdownOpen ? null : userRecord.user_id)}
                    disabled={savingUserId === userRecord.user_id}
                    className="inline-flex items-center px-4 py-2 border border-nordic/10 bg-white dark:bg-gray-800 shadow-sm text-xs font-medium rounded-lg text-nordic dark:text-white hover:bg-nordic hover:text-white focus:outline-none transition-colors w-full md:w-auto justify-center disabled:opacity-50"
                  >
                    {savingUserId === userRecord.user_id ? 'Saving...' : 'Change Role'}
                    <span className="material-icons text-[16px] ml-2">
                      {isDropdownOpen ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-52 rounded-xl shadow-xl bg-nordic border border-white/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="py-1">
                        <button
                          onClick={() => handleSelectRole(userRecord, 'admin')}
                          className={`w-full text-left flex items-center px-4 py-2.5 text-xs text-white/90 hover:bg-white/15 transition-colors ${
                            userRecord.role === 'admin' ? 'bg-white/20 font-bold text-white' : ''
                          }`}
                        >
                          <span className="material-icons text-sm mr-3 text-emerald-400">shield</span>
                          Administrator
                        </button>

                        <button
                          onClick={() => handleSelectRole(userRecord, 'agent')}
                          className={`w-full text-left flex items-center px-4 py-2.5 text-xs text-white/90 hover:bg-white/15 transition-colors ${
                            userRecord.role === 'agent' ? 'bg-white/20 font-bold text-white' : ''
                          }`}
                        >
                          <span className="material-icons text-sm mr-3 text-amber-300">support_agent</span>
                          Agent
                        </button>

                        <button
                          onClick={() => handleSelectRole(userRecord, 'user')}
                          className={`w-full text-left flex items-center px-4 py-2.5 text-xs text-white/90 hover:bg-white/15 transition-colors ${
                            userRecord.role === 'user' ? 'bg-white/20 font-bold text-white' : ''
                          }`}
                        >
                          <span className="material-icons text-sm mr-3 text-blue-300">person</span>
                          User (Client)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* Pagination Footer */}
      <footer className="mt-auto border-t border-nordic/5 bg-background-light dark:bg-background-dark py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-nordic/60 dark:text-gray-400">
                Showing <span className="font-medium text-nordic dark:text-white">{totalFiltered > 0 ? startIndex + 1 : 0}</span> to <span className="font-medium text-nordic dark:text-white">{endIndex}</span> of <span className="font-medium text-nordic dark:text-white">{totalFiltered}</span> users
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1 || totalFiltered === 0}
                className="px-3.5 py-1.5 text-sm border border-gray-200 dark:border-primary/30 rounded-md text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-primary/20 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-all"
              >
                Anterior
              </button>
              <span className="px-3 py-1.5 text-xs font-semibold text-primary dark:text-emerald-300 bg-primary/10 rounded-md">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages || totalFiltered === 0}
                className="px-3.5 py-1.5 text-sm border border-gray-200 dark:border-primary/30 rounded-md text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-primary/20 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-all"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal for Add User */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#152e2a] border border-white/20 dark:border-primary/30 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-nordic dark:text-white flex items-center gap-2">
                <span className="material-icons text-primary">person_add</span>
                Add New User Role
              </h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 hover:text-nordic dark:hover:text-white"
              >
                <span className="material-icons text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  User Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="user@luxuryestates.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-[#0f2320] border border-gray-300 dark:border-primary/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-nordic dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Assign Access Role
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-[#0f2320] border border-gray-300 dark:border-primary/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-nordic dark:text-white font-medium cursor-pointer"
                >
                  <option value="user">User (Client)</option>
                  <option value="agent">Agent</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-white/10 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
                >
                  Save User Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
