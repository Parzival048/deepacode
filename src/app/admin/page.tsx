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
      <h1 className="mb-4 text-xl font-bold sm:mb-6 sm:text-2xl">Admin dashboard</h1>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 pl-4 pr-4 pt-4 sm:pl-6 sm:pr-6 sm:pt-6">
              <CardTitle className="text-xs font-medium sm:text-sm">{s.title}</CardTitle>
              <s.icon className="h-3.5 w-3.5 text-muted-foreground sm:h-4 sm:w-4" />
            </CardHeader>
            <CardContent className="pl-4 pb-4 sm:pl-6 sm:pb-6">
              <p className="text-xl font-bold sm:text-2xl">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
