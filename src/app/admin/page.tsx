import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, CreditCard, Cloud } from 'lucide-react';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: usersCount },
    { count: requirementsCount },
    { count: paymentsCount },
    { count: servicesCount },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('requirements').select('*', { count: 'exact', head: true }),
    supabase.from('payments').select('*', { count: 'exact', head: true }),
    supabase.from('cloud_services').select('*', { count: 'exact', head: true }),
  ]);

  const stats = [
    { title: 'Users', value: usersCount ?? 0, icon: Users },
    { title: 'Requirements', value: requirementsCount ?? 0, icon: FileText },
    { title: 'Payments', value: paymentsCount ?? 0, icon: CreditCard },
    { title: 'Cloud services', value: servicesCount ?? 0, icon: Cloud },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{s.title}</CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
