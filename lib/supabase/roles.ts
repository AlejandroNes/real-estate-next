import { supabase } from './client';

export type UserRole = 'admin' | 'agent' | 'user';

export interface UserRoleRecord {
  id: string;
  user_id: string;
  email: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

const MOCK_USER_ROLES: UserRoleRecord[] = [
  {
    id: 'role-1',
    user_id: 'usr-admin-01',
    email: 'admin@luxeestate.com',
    role: 'admin',
    created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'role-2',
    user_id: 'usr-agent-01',
    email: 'agent.valencia@luxeestate.com',
    role: 'agent',
    created_at: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'role-3',
    user_id: 'usr-user-01',
    email: 'client.beverly@example.com',
    role: 'user',
    created_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
  },
];

let inMemoryRoles: UserRoleRecord[] = [...MOCK_USER_ROLES];

/**
 * Fetch a single user's role from Supabase or memory fallback.
 */
export async function getUserRole(userId: string): Promise<UserRole> {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();

    if (!error && data?.role) {
      return data.role as UserRole;
    }
  } catch (err) {
    console.warn('[getUserRole] Supabase query error:', err);
  }

  const found = inMemoryRoles.find((r) => r.user_id === userId);
  return found?.role || 'user';
}

/**
 * Fetch all user roles for the Admin Dashboard user management table.
 */
export async function getAllUserRoles(): Promise<UserRoleRecord[]> {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      if (data.length > 0) {
        return data as UserRoleRecord[];
      }
    } else if (error) {
      console.warn('[getAllUserRoles] Supabase error:', error.message);
    }
  } catch (err) {
    console.warn('[getAllUserRoles] Exception:', err);
  }

  return inMemoryRoles;
}

/**
 * Upsert/Update a user's role in Supabase.
 */
export async function updateUserRole(userId: string, email: string, newRole: UserRole): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('user_roles')
      .upsert(
        {
          user_id: userId,
          email: email,
          role: newRole,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

    if (error) {
      console.error('[updateUserRole] Supabase error:', error.message);
      return { success: false, error: error.message };
    }

    // Update in-memory cache as well
    const idx = inMemoryRoles.findIndex((r) => r.user_id === userId);
    if (idx >= 0) {
      inMemoryRoles[idx].role = newRole;
    } else {
      inMemoryRoles.push({
        id: `role-${Date.now()}`,
        user_id: userId,
        email: email,
        role: newRole,
        created_at: new Date().toISOString(),
      });
    }

    return { success: true };
  } catch (err: any) {
    console.error('[updateUserRole] Exception:', err.message);
    return { success: false, error: err.message };
  }
}
