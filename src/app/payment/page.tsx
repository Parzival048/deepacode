import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getCurrentPlan } from '@/lib/actions/subscription';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

const PLANS = [
  { id: 'free', name: 'Free', price: 0, features: ['Basic recommendation', 'Cost estimate', 'Roadmap'] },
  { id: 'pro', name: 'Pro', price: 29, features: ['Everything in Free', 'Detailed advisory report', 'Architecture review', 'Email support'] },
  { id: 'enterprise', name: 'Enterprise', price: 99, features: ['Everything in Pro', 'Full architecture design', 'Migration plan', 'Priority support'] },
];

export default async function PaymentPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const currentPlan = await getCurrentPlan();
  if (!user) {
    return (
      <div className="container px-4 py-8 text-center sm:py-12">
        <p className="text-sm sm:text-base">Please log in to view plans.</p>
        <Link href="/login" className="mt-4 inline-block">
          <Button className="min-h-[44px]">Log in</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl px-4 py-6 sm:py-8">
      <div className="mb-6 text-center sm:mb-8">
        <h1 className="text-xl font-bold sm:text-2xl">Subscription plans</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">Unlock premium cloud advisory reports.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
        {PLANS.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          return (
            <Card key={plan.id} className={plan.id === currentPlan ? 'border-primary shadow-md' : plan.id === 'enterprise' ? 'border-primary/50' : ''}>
              <CardHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
                <CardTitle className="flex flex-wrap items-center gap-2 text-base sm:text-lg">
                  {plan.name}
                  {isCurrent && <span className="text-xs font-normal text-primary">(Current)</span>}
                </CardTitle>
                <CardDescription className="text-sm">${plan.price}/month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-4 pb-4 sm:px-6 sm:pb-6">
                <ul className="space-y-2">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs sm:text-sm">
                      <Check className="h-3.5 w-3.5 shrink-0 text-primary sm:h-4 sm:w-4" />
                      {f}
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <Button className="h-11 w-full min-h-[44px]" variant="outline" disabled>Current plan</Button>
                ) : (
                  <Link href={`/api/checkout?plan=${plan.id}`} className="block">
                    <Button className="h-11 w-full min-h-[44px]" variant={plan.id === 'enterprise' ? 'default' : 'outline'}>Subscribe</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground sm:mt-8 sm:text-sm">
        Payment is processed securely via Stripe. In production, wire the checkout link to your Stripe account.
      </p>
    </div>
  );
}
