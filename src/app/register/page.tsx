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
      <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8 sm:py-12">
        <Card className="w-full max-w-md border-border/80 shadow-lg">
          <CardHeader className="px-4 pt-6 pb-4 sm:px-6 sm:pt-8 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl">Create account</CardTitle>
            <CardDescription className="text-sm">Sign up for Smart Cloud Advisor.</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-6 sm:px-6 sm:pb-8">
            {error && (
              <p className="mb-4 text-sm text-destructive">{error}</p>
            )}
            <form action={signUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full name</Label>
                <Input id="full_name" name="full_name" type="text" placeholder="Jane Doe" className="min-h-[44px] rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required className="min-h-[44px] rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" minLength={6} required className="min-h-[44px] rounded-lg" />
              </div>
              <Button type="submit" className="h-11 w-full min-h-[44px] rounded-xl">Sign up</Button>
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
