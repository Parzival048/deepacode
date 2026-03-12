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
      <div className="container py-12 text-center">
        <p>Please log in to view plans.</p>
        <Link href="/login">
          <Button className="mt-4">Log in</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">Subscription plans</h1>
        <p className="text-muted-foreground">Unlock premium cloud advisory reports.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          return (
            <Card key={plan.id} className={plan.id === currentPlan ? 'border-primary shadow-md' : plan.id === 'enterprise' ? 'border-primary/50' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {plan.name}
                  {isCurrent && <span className="text-xs font-normal text-primary">(Current)</span>}
                </CardTitle>
                <CardDescription>
                  ${plan.price}/month
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <Button className="w-full" variant="outline" disabled>Current plan</Button>
                ) : (
                  <Link href={`/api/checkout?plan=${plan.id}`}>
                    <Button className="w-full" variant={plan.id === 'enterprise' ? 'default' : 'outline'}>Subscribe</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Payment is processed securely via Stripe. In production, wire the checkout link to your Stripe account.
      </p>
    </div>
  );
}
