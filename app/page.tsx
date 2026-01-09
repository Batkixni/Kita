import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowRight, Layers, Palette, Zap } from "lucide-react";
import Link from "next/link";
import { LandingHero } from "@/components/landing/LandingHero";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (session?.user?.username) {
    redirect(`/${session.user.username}`);
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <LandingHero />

      {/* Features / Info Section */}
      <section className="py-32 px-4 container mx-auto relative z-10 bg-background">
        <div className="max-w-4xl mx-auto text-center space-y-16">
          <div>
            <h2 className="text-4xl font-bold mb-6">Everything you need.</h2>
            <p className="text-xl text-muted-foreground">Kita gives you the building blocks to express yourself properly.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-8 rounded-3xl bg-secondary/30 border border-border/50">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Layers className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Bento Grid</h3>
              <p className="text-muted-foreground">The most flexible drag-and-drop grid system. Arrange your content exactly how you want it.</p>
            </div>
            <div className="p-8 rounded-3xl bg-secondary/30 border border-border/50">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Palette className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Theming</h3>
              <p className="text-muted-foreground">Deep customization options. Control colors, radius, fonts and more with one click.</p>
            </div>
            <div className="p-8 rounded-3xl bg-secondary/30 border border-border/50">
              <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant</h3>
              <p className="text-muted-foreground">Built on modern tech for instant loads and smooth interactions. Your page is always fast.</p>
            </div>
          </div>

          <div className="pt-20">
            <h2 className="text-8xl font-black mb-12 tracking-tighter">Ready?</h2>
            <Link href="/sign-up" className="inline-flex items-center gap-2 h-16 px-10 rounded-full bg-primary text-primary-foreground font-bold text-2xl hover:scale-105 transition-transform">
              Claim Username <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-border/40 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Kita. All rights reserved.
      </footer>
    </main>
  );
}
