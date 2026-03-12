import Link from 'next/link';
import { signUp } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const error = searchParams.error;
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-muted/30 to-background">
      <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
        <Card className="w-full max-w-md border-border/80 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Create account</CardTitle>
            <CardDescription>Sign up for Smart Cloud Advisor.</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <p className="text-sm text-destructive mb-4">{error}</p>
            )}
            <form action={signUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full name</Label>
                <Input id="full_name" name="full_name" type="text" placeholder="Jane Doe" className="rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required className="rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" minLength={6} required className="rounded-lg" />
              </div>
              <Button type="submit" className="w-full rounded-xl">Sign up</Button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account? <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">Log in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
