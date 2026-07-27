import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl;

  // Protect /admin routes
  if (url.pathname.startsWith('/admin')) {
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirectTo', url.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Query user_roles from database
    let role = 'user'; // Strict default: regular user, NOT admin

    try {
      const { data: userRoleRecord } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (userRoleRecord?.role) {
        role = userRoleRecord.role;
      } else if (user.user_metadata?.role) {
        role = user.user_metadata.role;
      }
    } catch (e) {
      console.warn('[proxy] Error verifying user role:', e);
    }

    // STRICT ACCESS CONTROL: Only users with 'admin' role can access /admin
    if (role !== 'admin') {
      const unauthorizedUrl = new URL('/?unauthorized=true', request.url);
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
