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
    <div className="container py-6">
      <nav className="mb-8 flex gap-4 border-b pb-4">
        <Link href="/admin">
          <Button variant="ghost">Dashboard</Button>
        </Link>
        <Link href="/admin/analytics">
          <Button variant="ghost">Analytics</Button>
        </Link>
        <Link href="/admin/cloud-services">
          <Button variant="ghost">Cloud services</Button>
        </Link>
      </nav>
      {children}
    </div>
  );
}
