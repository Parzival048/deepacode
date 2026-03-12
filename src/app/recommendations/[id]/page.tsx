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
        <div className="container max-w-4xl py-8 md:py-10">
          {/* Header */}
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <Link
                href="/dashboard"
                className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to dashboard
              </Link>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  Recommendation report
                </h1>
                {isPremium && (
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-primary/20">
                    {isEnterprise ? 'Enterprise' : 'Pro'}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Created {format(new Date(requirement.created_at), 'MMMM d, yyyy · h:mm a')}
              </p>
            </div>
          </div>

          {/* Your input */}
          {requirement.prompt_input && (
            <Card className="mb-6 border-border/80 shadow-sm overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Your input
                </CardTitle>
                <CardDescription>Prompt and questionnaire data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm leading-relaxed text-foreground">{requirement.prompt_input}</p>
                <pre className="max-h-44 rounded-xl border border-border/80 bg-muted/40 p-4 text-xs leading-relaxed overflow-auto">
                  {JSON.stringify(requirement.questionnaire_data, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {recommendation && (
            <>
              {/* Recommended provider */}
              <Card className="mb-6 border-border/80 shadow-sm overflow-hidden">
                <CardHeader className="border-b border-border/60 bg-muted/20 py-5">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Cloud className="h-5 w-5 text-primary" />
                    Recommended provider
                  </CardTitle>
                  <CardDescription>Best fit for your requirements</CardDescription>
                </CardHeader>
                <CardContent className="pt-5">
                  <div className="inline-flex items-center rounded-xl bg-primary/10 px-4 py-2 text-xl font-bold text-primary">
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
              <Card className="mb-6 border-border/80 shadow-sm overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Cost estimation
                  </CardTitle>
                  <CardDescription>Estimated monthly cost (USD)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl border-2 border-primary/20 bg-primary/5 px-5 py-4">
                    <p className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                      ${totalCost}
                      <span className="ml-1 text-lg font-normal text-muted-foreground">/month</span>
                    </p>
                  </div>
                  <div className="mt-5 space-y-4">
                    {services.map((s, i) => {
                      const value = s.estimated_cost_monthly ?? 0;
                      const pct = totalCost > 0 ? (value / totalCost) * 100 : 0;
                      return (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-foreground">{s.name}</span>
                            <span className="font-medium text-muted-foreground">${value}/mo</span>
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
              <Card className="mb-6 border-border/80 shadow-sm overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                    Cloud adoption roadmap
                  </CardTitle>
                  <CardDescription>Step-by-step setup guide</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <ol className="relative">
                    {roadmap.map((step, idx) => (
                      <li key={step.step} className="relative flex gap-5 pb-8 last:pb-0">
                        {idx < roadmap.length - 1 && (
                          <span
                            className="absolute left-[15px] top-10 bottom-0 w-0.5 bg-gradient-to-b from-primary/40 to-transparent"
                            aria-hidden
                          />
                        )}
                        <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background text-sm font-bold text-primary shadow-sm">
                          {step.step}
                        </span>
                        <div className="pt-0.5 min-w-0">
                          <p className="font-semibold text-foreground">{step.title}</p>
                          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
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
                  <Card className="mb-6 overflow-hidden border-primary/25 bg-gradient-to-br from-primary/[0.04] to-transparent shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Shield className="h-5 w-5 text-primary" />
                        Full architecture design
                      </CardTitle>
                      <CardDescription>Premium: detailed infrastructure blueprint</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
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
                  <Card className="mb-6 overflow-hidden border-primary/25 bg-gradient-to-br from-primary/[0.04] to-transparent shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <FileDown className="h-5 w-5 text-primary" />
                        Migration plan
                      </CardTitle>
                      <CardDescription>Premium: phased migration checklist</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ol className="space-y-2 text-sm font-medium text-foreground [list-style:decimal] [padding-inline-start:1.25rem]">
                        <li>Phase 1: Account setup, IAM, and networking (Week 1)</li>
                        <li>Phase 2: Data migration and validation (Week 2–3)</li>
                        <li>Phase 3: Application deployment and cutover (Week 4)</li>
                        <li>Phase 4: Optimization and monitoring (Ongoing)</li>
                      </ol>
                    </CardContent>
                  </Card>
                  <Card className="mb-6 overflow-hidden border-primary/25 bg-gradient-to-br from-primary/[0.04] to-transparent shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Headphones className="h-5 w-5 text-primary" />
                        Priority support
                      </CardTitle>
                      <CardDescription>Premium: dedicated support channel</CardDescription>
                    </CardHeader>
                    <CardContent>
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
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">Need a detailed premium report?</p>
                <Link href="/payment" className="mt-4">
                  <Button size="lg" className="rounded-xl shadow-md shadow-primary/20">
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
