import Link from 'next/link';
import { setPlanAfterCheckout } from '@/lib/actions/subscription';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: { plan?: string };
}) {
  const plan = searchParams.plan;
  if (plan === 'pro' || plan === 'enterprise') {
    await setPlanAfterCheckout(plan);
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gradient-to-b from-emerald-50/50 to-background px-4 py-8 sm:py-12">
      <Card className="w-full max-w-md overflow-hidden border-0 bg-card/95 shadow-xl shadow-primary/5 backdrop-blur">
        <div className="h-1 w-full bg-gradient-to-r from-primary to-primary/70" />
        <CardHeader className="pb-2 pt-6 text-center sm:pt-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/5 sm:h-14 sm:w-14">
            <CheckCircle2 className="h-6 w-6 text-primary sm:h-8 sm:w-8" aria-hidden />
          </div>
          <h1 className="mt-3 text-lg font-semibold tracking-tight sm:mt-4 sm:text-xl">Payment successful</h1>
        </CardHeader>
        <CardContent className="space-y-6 pb-6 pt-2 text-center sm:pb-8">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Your premium report is now unlocked. View your recommendations and full architecture details from the dashboard.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button className="h-11 w-full min-h-[44px] gap-2 shadow-sm sm:w-auto">
                Go to dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
