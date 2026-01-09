import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { MockGrid } from "@/components/landing/MockGrid";
import { ArrowRight, Layers, LayoutGrid, Palette, Zap } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (session?.user?.username) {
    redirect(`/${session.user.username}`);
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navigation */}
      <header className="w-full border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tighter flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-md" />
            Kita
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link href="/sign-up" className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-bold hover:opacity-90 transition-opacity">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col pt-12 pb-20 md:pt-20 md:pb-32 px-4 container mx-auto items-center">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-6">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground leading-[1.1]">
            Your corner of <br /> <span className="text-muted-foreground">the internet.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Build a beautiful, personalized bento-style page to showcase your links, projects, and thoughts. No coding required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link href="/sign-up" className="h-12 px-8 rounded-full bg-primary text-primary-foreground font-bold text-lg flex items-center gap-2 hover:scale-105 transition-transform">
              Claim your username <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-xs text-muted-foreground mt-2 sm:mt-0">Free to start. No credit card required.</p>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="w-full relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 bottom-0 h-20" />
          <MockGrid />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-secondary/30 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything needed to express yourself.</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Kita gives you the building blocks to create a page that truly represents you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-card border border-border/50 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-chart-3/10 text-chart-3 rounded-2xl flex items-center justify-center mb-4">
                <LayoutGrid className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Bento Grid Layout</h3>
              <p className="text-muted-foreground leading-relaxed">
                Drag, drop, and resize modules to create a layout that fits your content perfectly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card border border-border/50 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-chart-5/10 text-chart-5 rounded-2xl flex items-center justify-center mb-4">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Custom Themes</h3>
              <p className="text-muted-foreground leading-relaxed">
                Choose from beautiful presets or customize every color and radius to match your brand style.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card border border-border/50 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-chart-4/10 text-chart-4 rounded-2xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Fast & Dynamic</h3>
              <p className="text-muted-foreground leading-relaxed">
                Built on Next.js for incredible speed. Animations and interactions feel instant and smooth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p className="mb-4 font-bold text-foreground text-lg">Kita</p>
          <p>&copy; {new Date().getFullYear()} Kita. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
