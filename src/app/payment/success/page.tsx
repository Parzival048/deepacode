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
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 bg-gradient-to-b from-emerald-50/50 to-background">
      <Card className="w-full max-w-md border-0 shadow-xl shadow-primary/5 bg-card/95 backdrop-blur overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-primary to-primary/70" />
        <CardHeader className="text-center pt-8 pb-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/5">
            <CheckCircle2 className="h-8 w-8 text-primary" aria-hidden />
          </div>
          <h1 className="mt-4 text-xl font-semibold tracking-tight">Payment successful</h1>
        </CardHeader>
        <CardContent className="pb-8 pt-2 text-center space-y-6">
          <p className="text-muted-foreground text-sm leading-relaxed">
            Your premium report is now unlocked. View your recommendations and full architecture details from the dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard">
              <Button className="w-full sm:w-auto shadow-sm gap-2">
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
