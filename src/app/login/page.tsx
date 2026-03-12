import Link from 'next/link';
import { signIn } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string; error?: string };
}) {
  const redirectTo = searchParams.redirect ?? '';
  const error = searchParams.error;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-muted/30 to-background">
      <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
        <Card className="w-full max-w-md border-border/80 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Log in</CardTitle>
            <CardDescription>Sign in to your Smart Cloud Advisor account.</CardDescription>
          </CardHeader>
        <CardContent>
          {error && (
            <p className="text-sm text-destructive mb-4">{error}</p>
          )}
          <form action={signIn} className="space-y-4">
            <input type="hidden" name="redirect" value={redirectTo} />
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required className="rounded-lg" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required className="rounded-lg" />
            </div>
            <Button type="submit" className="w-full rounded-xl">Sign in</Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account? <Link href="/register" className="font-medium text-primary underline-offset-4 hover:underline">Sign up</Link>
          </p>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
