import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') redirect('/dashboard');

  return (
    <div className="container px-4 py-4 sm:py-6">
      <nav className="mb-6 flex flex-wrap gap-2 border-b pb-4 sm:mb-8 sm:gap-4">
        <Link href="/admin">
          <Button variant="ghost" className="min-h-[44px] sm:min-h-9">Dashboard</Button>
        </Link>
        <Link href="/admin/analytics">
          <Button variant="ghost" className="min-h-[44px] sm:min-h-9">Analytics</Button>
        </Link>
        <Link href="/admin/cloud-services">
          <Button variant="ghost" className="min-h-[44px] sm:min-h-9">Cloud services</Button>
        </Link>
      </nav>
      {children}
    </div>
  );
}
