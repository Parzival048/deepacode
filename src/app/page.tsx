import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, BarChart3, Route, CreditCard, ArrowRight, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,oklch(0.45_0.12_195/0.15),transparent)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_80%_50%,oklch(0.72_0.16_65/0.08),transparent)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_40%_at_20%_80%,oklch(0.45_0.12_195/0.06),transparent)]" />

      <div className="container relative py-16 md:py-24 lg:py-32">
        {/* Hero */}
        <section className="mx-auto max-w-4xl text-center">
          <div className="animate-in-up opacity-0 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Smart cloud advisory
          </div>
          <h1 className="animate-in-up animate-in-up-delay-1 mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Multi-Cloud Recommendation & Cost Optimization
          </h1>
          <p className="animate-in-up animate-in-up-delay-2 mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Enter your infrastructure requirements and get intelligent recommendations for AWS, Azure, and GCP—with cost estimates and a clear adoption roadmap.
          </p>
          <div className="animate-in-up animate-in-up-delay-3 mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="h-12 rounded-xl px-8 text-base shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5">
                Get started free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="h-12 rounded-xl border-2 px-8 text-base transition-all hover:bg-primary/5 hover:border-primary/30">
                Log in
              </Button>
            </Link>
          </div>
        </section>

        {/* Feature cards */}
        <section className="mt-24 md:mt-32">
          <p className="animate-in-up animate-in-up-delay-4 text-center text-sm font-medium uppercase tracking-wider text-primary">
            What you get
          </p>
          <h2 className="animate-in-up animate-in-up-delay-4 mt-2 text-center text-2xl font-bold text-foreground md:text-3xl">
            Everything you need to choose and adopt the cloud
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Cloud,
                title: 'Multi-Cloud',
                description: 'Compare AWS, Azure, and GCP with one questionnaire.',
                delayClass: 'animate-in-up-delay-1',
              },
              {
                icon: BarChart3,
                title: 'Cost estimation',
                description: 'Monthly cost breakdown and budget optimization.',
                delayClass: 'animate-in-up-delay-2',
              },
              {
                icon: Route,
                title: 'Adoption roadmap',
                description: 'Step-by-step deployment and migration guide.',
                delayClass: 'animate-in-up-delay-3',
              },
              {
                icon: CreditCard,
                title: 'Plans & reports',
                description: 'Premium advisory reports via subscription.',
                delayClass: 'animate-in-up-delay-4',
              },
            ].map((item) => (
              <Card
                key={item.title}
                className={`animate-in-up ${item.delayClass} group relative overflow-hidden border-border/80 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <CardHeader className="relative">
                  <div className="mb-2 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">{item.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA strip */}
        <section className="mt-24 md:mt-32">
          <div className="animate-in-up animate-in-up-delay-5 relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 p-8 md:p-12 text-center">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-1/2 translate-y-1/2 rounded-full bg-accent/10 blur-2xl" />
            <h2 className="relative text-xl font-bold text-foreground md:text-2xl">
              Ready to optimize your cloud spend?
            </h2>
            <p className="relative mt-2 text-muted-foreground">
              Join and get your first recommendation in minutes.
            </p>
            <Link href="/register" className="relative mt-6 inline-block">
              <Button size="lg" className="h-12 rounded-xl bg-primary px-8 text-base shadow-lg shadow-primary/20 hover:bg-primary/90">
                Start for free
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
