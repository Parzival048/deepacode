import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { SignOutButton } from '@/components/auth/SignOutButton';
import { Cloud } from 'lucide-react';

export async function Nav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-14 min-h-[56px] items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <Link href="/" className="flex min-w-0 shrink items-center gap-2 font-semibold text-foreground transition-opacity hover:opacity-90">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Cloud className="h-4 w-4" />
          </span>
          <span className="truncate text-sm sm:text-base">Smart Cloud Advisor</span>
        </Link>
        <nav className="flex shrink-0 flex-wrap items-center justify-end gap-1 sm:gap-2">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-lg px-2.5 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary/5 hover:text-foreground min-h-[44px] min-w-[44px] flex items-center justify-center sm:min-h-0 sm:min-w-0 sm:px-3 sm:py-2 sm:text-sm"
              >
                Dashboard
              </Link>
              <Link
                href="/requirements/new"
                className="flex min-h-[44px] min-w-0 items-center justify-center rounded-lg px-2.5 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary/5 hover:text-foreground sm:min-h-0 sm:px-3 sm:py-2 sm:text-sm"
              >
                New requirement
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="min-h-[44px] rounded-lg font-medium sm:min-h-9">Log in</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="min-h-[44px] rounded-lg font-medium shadow-sm sm:min-h-9">Sign up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
