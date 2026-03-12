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
      <h1 className="mb-4 text-xl font-bold sm:mb-6 sm:text-2xl">Cloud services</h1>
      {error && <p className="text-sm text-destructive sm:text-base">{error.message}</p>}
      {!services?.length ? (
        <Card>
          <CardContent className="px-4 py-6 text-center text-sm text-muted-foreground sm:px-6 sm:py-8">
            No cloud services in the knowledge base yet. Add seed data via SQL or an admin form.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {(services ?? []).map((s) => (
            <Card key={s.id}>
              <CardHeader className="pb-2 pl-4 pr-4 pt-4 sm:pl-6 sm:pr-6 sm:pt-6">
                <CardTitle className="text-sm font-medium sm:text-base">{s.service_name}</CardTitle>
                <CardDescription className="text-xs sm:text-sm">{s.provider} · {s.category}</CardDescription>
              </CardHeader>
              {s.description && (
                <CardContent className="pl-4 pb-4 sm:pl-6 sm:pb-6">
                  <p className="text-xs sm:text-sm">{s.description}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
