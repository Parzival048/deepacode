import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format, subDays } from 'date-fns';

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();
  const start = subDays(new Date(), 30);
  const startStr = start.toISOString();

  const { data: events } = await supabase
    .from('analytics_events')
    .select('event_type, created_at')
    .gte('created_at', startStr)
    .order('created_at', { ascending: false })
    .limit(100);

  const byType = (events ?? []).reduce<Record<string, number>>((acc, e) => {
    acc[e.event_type] = (acc[e.event_type] ?? 0) + 1;
    return acc;
  }, {});

  const { data: recentRequirements } = await supabase
    .from('requirements')
    .select('id, created_at')
    .order('created_at', { ascending: false })
    .limit(10);

  return (
    <div className="space-y-6 sm:space-y-8">
      <h1 className="text-xl font-bold sm:text-2xl">Analytics</h1>

      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-base sm:text-lg">Events by type (last 30 days)</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Usage and activity</CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <ul className="space-y-2">
            {Object.entries(byType).map(([type, count]) => (
              <li key={type} className="flex flex-wrap justify-between gap-x-2 text-xs sm:text-sm">
                <span className="min-w-0 break-words">{type}</span>
                <span className="shrink-0">{count}</span>
              </li>
            ))}
            {Object.keys(byType).length === 0 && (
              <li className="text-sm text-muted-foreground">No events yet.</li>
            )}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-base sm:text-lg">Recent requirements</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Latest submissions</CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <ul className="space-y-2">
            {(recentRequirements ?? []).map((r) => (
              <li key={r.id} className="flex flex-wrap justify-between gap-x-2 text-xs sm:text-sm">
                <span className="font-mono">{r.id.slice(0, 8)}...</span>
                <span className="shrink-0 text-muted-foreground">{format(new Date(r.created_at), 'PP')}</span>
              </li>
            ))}
            {(recentRequirements ?? []).length === 0 && (
              <li className="text-sm text-muted-foreground">No requirements yet.</li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
