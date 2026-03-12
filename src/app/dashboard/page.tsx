import Link from 'next/link';
import { getMyRequirements } from '@/lib/actions/requirements';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, FileText, ArrowRight, LayoutDashboard } from 'lucide-react';
import { format } from 'date-fns';

export default async function DashboardPage() {
  const { data: requirements, error } = await getMyRequirements();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_40%_at_50%_-10%,oklch(0.45_0.12_195/0.08),transparent)]" />
      <div className="relative bg-gradient-to-b from-muted/20 to-background">
        <div className="container px-4 py-6 sm:px-6 sm:py-8 md:py-10">
          {/* Page header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-medium text-primary sm:text-sm">
                <LayoutDashboard className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                Dashboard
              </div>
              <h1 className="mt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">
                Your reports
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Cloud requirement submissions and recommendation reports.
              </p>
            </div>
            <Link href="/requirements/new" className="shrink-0">
              <Button className="h-11 w-full min-h-[44px] rounded-xl px-5 shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 sm:w-auto sm:px-6">
                <PlusCircle className="mr-2 h-4 w-4" />
                New requirement
              </Button>
            </Link>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive sm:mt-6">
              {error}
            </div>
          )}

          <div className="mt-6 sm:mt-8">
            {!requirements?.length ? (
              <Card className="border-border/80 bg-card/95 overflow-hidden shadow-lg">
                <CardContent className="flex flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <FileText className="h-10 w-10" />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold sm:mt-6 sm:text-xl">No requirements yet</h2>
                  <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
                    Submit your first requirement to get a cloud provider recommendation, cost estimate, and adoption roadmap.
                  </p>
                  <Link href="/requirements/new" className="mt-6 w-full sm:mt-8 sm:w-auto">
                    <Button size="lg" className="h-11 w-full min-h-[44px] rounded-xl px-6 shadow-md shadow-primary/20 sm:px-8">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      New requirement
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
                {requirements.map((r) => (
                  <Card
                    key={r.id}
                    className="group relative overflow-hidden border-border/80 bg-card/95 transition-all duration-200 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                    <CardHeader className="relative pb-2 pl-4 pr-4 pt-4 sm:pl-6 sm:pr-6 sm:pt-6">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-sm font-semibold leading-snug sm:text-base">
                            <Link
                              href={`/recommendations/${r.id}`}
                              className="line-clamp-2 text-foreground transition-colors hover:text-primary"
                            >
                              {r.prompt_input?.trim() || 'Requirement'}
                              {!r.prompt_input?.trim() && (
                                <span className="font-mono text-muted-foreground"> #{r.id.slice(0, 8)}</span>
                              )}
                            </Link>
                          </CardTitle>
                          <CardDescription className="mt-1.5 flex items-center gap-1.5 text-xs">
                            {format(new Date(r.created_at), 'MMM d, yyyy · h:mm a')}
                          </CardDescription>
                        </div>
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                          <FileText className="h-4 w-4" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="relative px-4 pb-4 pt-0 sm:px-6 sm:pb-6">
                      <Link href={`/recommendations/${r.id}`} className="block">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-10 w-full min-h-[44px] rounded-lg border-primary/20 font-medium transition-colors hover:bg-primary/5 hover:border-primary/30 sm:min-h-0"
                        >
                          View report
                          <ArrowRight className="ml-2 h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
