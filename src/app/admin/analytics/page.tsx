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
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Analytics</h1>

      <Card>
        <CardHeader>
          <CardTitle>Events by type (last 30 days)</CardTitle>
          <CardDescription>Usage and activity</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {Object.entries(byType).map(([type, count]) => (
              <li key={type} className="flex justify-between text-sm">
                <span>{type}</span>
                <span>{count}</span>
              </li>
            ))}
            {Object.keys(byType).length === 0 && (
              <li className="text-muted-foreground text-sm">No events yet.</li>
            )}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent requirements</CardTitle>
          <CardDescription>Latest submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {(recentRequirements ?? []).map((r) => (
              <li key={r.id} className="flex justify-between text-sm">
                <span className="font-mono">{r.id.slice(0, 8)}...</span>
                <span className="text-muted-foreground">{format(new Date(r.created_at), 'PP')}</span>
              </li>
            ))}
            {(recentRequirements ?? []).length === 0 && (
              <li className="text-muted-foreground text-sm">No requirements yet.</li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
