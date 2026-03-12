import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AdminCloudServicesPage() {
  const supabase = await createClient();
  const { data: services, error } = await supabase
    .from('cloud_services')
    .select('id, provider, category, service_name, description')
    .order('provider')
    .order('category');

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Cloud services</h1>
      {error && <p className="text-destructive">{error.message}</p>}
      {!services?.length ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No cloud services in the knowledge base yet. Add seed data via SQL or an admin form.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {(services ?? []).map((s) => (
            <Card key={s.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{s.service_name}</CardTitle>
                <CardDescription>{s.provider} · {s.category}</CardDescription>
              </CardHeader>
              {s.description && (
                <CardContent>
                  <p className="text-sm">{s.description}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
