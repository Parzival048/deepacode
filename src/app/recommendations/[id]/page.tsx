import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getRequirementWithRecommendation } from '@/lib/actions/requirements';
import { getCurrentPlan } from '@/lib/actions/subscription';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import {
  Shield,
  FileDown,
  Headphones,
  ArrowLeft,
  Cloud,
  DollarSign,
  MapPin,
  MessageSquare,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function RecommendationReportPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { data, error } = await getRequirementWithRecommendation(id);
  if (error || !data) notFound();
  const plan = await getCurrentPlan();

  const { requirement, recommendation } = data;
  const cost = recommendation?.cost_estimation as { total_monthly?: number; currency?: string; breakdown?: { service: string; cost: number }[] } | null;
  const services = (recommendation?.services ?? []) as { name: string; estimated_cost_monthly?: number; description?: string }[];
  const roadmap = (recommendation?.roadmap ?? []) as { step: number; title: string; description: string }[];
  const isPremium = plan === 'pro' || plan === 'enterprise';
  const isEnterprise = plan === 'enterprise';
  const totalCost = cost?.total_monthly ?? 0;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_50%_at_50%_-15%,oklch(0.45_0.12_195/0.06),transparent)]" />
      <div className="relative bg-gradient-to-b from-muted/20 to-background">
        <div className="container max-w-4xl px-4 py-6 sm:px-6 sm:py-8 md:py-10">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <Link
              href="/dashboard"
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" />
              Back to dashboard
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">
                Recommendation report
              </h1>
              {isPremium && (
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary ring-1 ring-primary/20 sm:px-3 sm:py-1">
                  {isEnterprise ? 'Enterprise' : 'Pro'}
                </span>
              )}
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground sm:mt-2 sm:text-sm">
              Created {format(new Date(requirement.created_at), 'MMMM d, yyyy · h:mm a')}
            </p>
          </div>

          {/* Your input */}
          {requirement.prompt_input && (
            <Card className="mb-4 border-border/80 overflow-hidden shadow-sm sm:mb-6">
              <CardHeader className="pb-3 pl-4 pr-4 pt-4 sm:pl-6 sm:pr-6 sm:pt-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <MessageSquare className="h-4 w-4 shrink-0 text-primary sm:h-5 sm:w-5" />
                  Your input
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Prompt and questionnaire data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pl-4 pr-4 pb-4 sm:pl-6 sm:pr-6 sm:pb-6">
                <p className="text-sm leading-relaxed text-foreground">{requirement.prompt_input}</p>
                <pre className="max-h-44 overflow-x-auto rounded-xl border border-border/80 bg-muted/40 p-3 text-xs leading-relaxed sm:p-4">
                  {JSON.stringify(requirement.questionnaire_data, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {recommendation && (
            <>
              {/* Recommended provider */}
              <Card className="mb-4 border-border/80 overflow-hidden shadow-sm sm:mb-6">
                <CardHeader className="border-b border-border/60 bg-muted/20 px-4 py-4 sm:px-6 sm:py-5">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Cloud className="h-4 w-4 shrink-0 text-primary sm:h-5 sm:w-5" />
                    Recommended provider
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Best fit for your requirements</CardDescription>
                </CardHeader>
                <CardContent className="px-4 pt-4 pb-4 sm:px-6 sm:pt-5 sm:pb-5">
                  <div className="inline-flex items-center rounded-xl bg-primary/10 px-3 py-1.5 text-lg font-bold text-primary sm:px-4 sm:py-2 sm:text-xl">
                    {recommendation.provider}
                  </div>
                  {recommendation.architecture_suggestion && (
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {recommendation.architecture_suggestion}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Cost estimation */}
              <Card className="mb-4 border-border/80 overflow-hidden shadow-sm sm:mb-6">
                <CardHeader className="pb-3 pl-4 pr-4 pt-4 sm:pl-6 sm:pr-6 sm:pt-6">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <DollarSign className="h-4 w-4 shrink-0 text-primary sm:h-5 sm:w-5" />
                    Cost estimation
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Estimated monthly cost (USD)</CardDescription>
                </CardHeader>
                <CardContent className="pl-4 pr-4 pb-4 sm:pl-6 sm:pr-6 sm:pb-6">
                  <div className="rounded-xl border-2 border-primary/20 bg-primary/5 px-4 py-3 sm:px-5 sm:py-4">
                    <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                      ${totalCost}
                      <span className="ml-1 text-lg font-normal text-muted-foreground">/month</span>
                    </p>
                  </div>
                  <div className="mt-4 space-y-4 sm:mt-5">
                    {services.map((s, i) => {
                      const value = s.estimated_cost_monthly ?? 0;
                      const pct = totalCost > 0 ? (value / totalCost) * 100 : 0;
                      return (
                        <div key={i} className="space-y-2">
                          <div className="flex flex-wrap justify-between gap-x-2 text-xs sm:text-sm">
                            <span className="min-w-0 font-medium text-foreground break-words">{s.name}</span>
                            <span className="shrink-0 font-medium text-muted-foreground">${value}/mo</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500"
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Roadmap */}
              <Card className="mb-4 border-border/80 overflow-hidden shadow-sm sm:mb-6">
                <CardHeader className="pb-3 pl-4 pr-4 pt-4 sm:pl-6 sm:pr-6 sm:pt-6">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <MapPin className="h-4 w-4 shrink-0 text-primary sm:h-5 sm:w-5" />
                    Cloud adoption roadmap
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Step-by-step setup guide</CardDescription>
                </CardHeader>
                <CardContent className="pl-4 pt-2 pb-4 sm:pl-6 sm:pr-6 sm:pb-6">
                  <ol className="relative">
                    {roadmap.map((step, idx) => (
                      <li key={step.step} className="relative flex gap-3 pb-6 last:pb-0 sm:gap-5 sm:pb-8">
                        {idx < roadmap.length - 1 && (
                          <span
                            className="absolute left-[11px] top-9 bottom-0 w-0.5 bg-gradient-to-b from-primary/40 to-transparent sm:left-[15px] sm:top-10"
                            aria-hidden
                          />
                        )}
                        <span className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background text-xs font-bold text-primary shadow-sm sm:h-8 sm:w-8 sm:text-sm">
                          {step.step}
                        </span>
                        <div className="min-w-0 flex-1 pt-0.5">
                          <p className="text-sm font-semibold text-foreground sm:text-base">{step.title}</p>
                          <p className="mt-1 text-xs text-muted-foreground leading-relaxed sm:text-sm">
                            {step.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              {/* Premium sections */}
              {isPremium && (
                <>
                  <Card className="mb-4 overflow-hidden border-primary/25 bg-gradient-to-br from-primary/[0.04] to-transparent shadow-sm sm:mb-6">
                    <CardHeader className="pb-2 pl-4 pr-4 pt-4 sm:pl-6 sm:pr-6 sm:pt-6">
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <Shield className="h-4 w-4 shrink-0 text-primary sm:h-5 sm:w-5" />
                        Full architecture design
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">Premium: detailed infrastructure blueprint</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 px-4 pb-4 text-sm sm:px-6 sm:pb-6">
                      <p className="leading-relaxed text-foreground">
                        Recommended three-tier architecture with compute in public/private subnets, managed database, and object storage. Enable auto-scaling and multi-AZ for production. Use a load balancer for traffic and CloudWatch/Application Insights for monitoring.
                      </p>
                      <ul className="space-y-1.5 pl-4 text-muted-foreground [list-style:disc]">
                        <li>VPC with public and private subnets across 2+ AZs</li>
                        <li>Managed RDS/Azure SQL/Cloud SQL with automated backups</li>
                        <li>S3/Blob/Cloud Storage for static assets and backups</li>
                        <li>IAM/Managed identities and encryption at rest</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="mb-4 overflow-hidden border-primary/25 bg-gradient-to-br from-primary/[0.04] to-transparent shadow-sm sm:mb-6">
                    <CardHeader className="pb-2 pl-4 pr-4 pt-4 sm:pl-6 sm:pr-6 sm:pt-6">
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <FileDown className="h-4 w-4 shrink-0 text-primary sm:h-5 sm:w-5" />
                        Migration plan
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">Premium: phased migration checklist</CardDescription>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                      <ol className="space-y-2 text-sm font-medium text-foreground [list-style:decimal] [padding-inline-start:1.25rem]">
                        <li>Phase 1: Account setup, IAM, and networking (Week 1)</li>
                        <li>Phase 2: Data migration and validation (Week 2–3)</li>
                        <li>Phase 3: Application deployment and cutover (Week 4)</li>
                        <li>Phase 4: Optimization and monitoring (Ongoing)</li>
                      </ol>
                    </CardContent>
                  </Card>
                  <Card className="mb-4 overflow-hidden border-primary/25 bg-gradient-to-br from-primary/[0.04] to-transparent shadow-sm sm:mb-6">
                    <CardHeader className="pb-2 pl-4 pr-4 pt-4 sm:pl-6 sm:pr-6 sm:pt-6">
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <Headphones className="h-4 w-4 shrink-0 text-primary sm:h-5 sm:w-5" />
                        Priority support
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">Premium: dedicated support channel</CardDescription>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        Contact your account manager or email{' '}
                        <a href="mailto:priority-support@smartcloudadvisor.com" className="font-medium text-primary underline-offset-4 hover:underline">
                          priority-support@smartcloudadvisor.com
                        </a>{' '}
                        for architecture reviews and migration assistance.
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}
            </>
          )}

          {/* Free CTA */}
          {plan === 'free' && (
            <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/[0.06] via-primary/[0.03] to-accent/5 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-8 text-center sm:py-12">
                <p className="text-sm text-muted-foreground sm:text-base">Need a detailed premium report?</p>
                <Link href="/payment" className="mt-4 w-full sm:w-auto sm:max-w-none">
                  <Button size="lg" className="h-11 w-full min-h-[44px] rounded-xl shadow-md shadow-primary/20 sm:w-auto">
                    Unlock premium report
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
