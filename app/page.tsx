import { auth } from "@/lib/auth";
import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowRight, Layers, Palette, Zap, Play } from "lucide-react";
import Link from "next/link";
import { LandingHero } from "@/components/landing/LandingHero";
import { UniqueLinkSection } from "@/components/landing/UniqueLinkSection";
import { Playfair_Display } from "next/font/google";
import { Footer } from "@/components/layout/Footer";

const fontSerif = Playfair_Display({ subsets: ["latin"], weight: ["400", "900"], style: ["normal", "italic"] });

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (session?.user?.username) {
    redirect(`/${session.user.username}`);
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <LandingHero />
      </Suspense>

      <UniqueLinkSection />

      {/* Features / Info Section */}
      <section className="py-32 px-4 container mx-auto relative z-10 bg-background">
        <div className="max-w-4xl mx-auto text-center space-y-24">

          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Crafted for those who <span className={`${fontSerif.className} italic font-normal text-muted-foreground`}>care</span>.
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We stripped away the clutter to give you the essential building blocks. <br />
              A platform designed to let your personality shine through, not overpower it.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-8 rounded-[32px] bg-secondary/20 border border-border/50 hover:bg-secondary/40 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Layers className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Bento Grid</h3>
              <p className="text-muted-foreground leading-relaxed">
                The most flexible drag-and-drop grid system. Arrange your content exactly how you want it, pixel perfect.
              </p>
            </div>
            <div className="p-8 rounded-[32px] bg-secondary/20 border border-border/50 hover:bg-secondary/40 transition-colors">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Palette className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Theming</h3>
              <p className="text-muted-foreground leading-relaxed">
                Deep customization without the headache. Control colors, radius, and typography with a single click.
              </p>
            </div>
            <div className="p-8 rounded-[32px] bg-secondary/20 border border-border/50 hover:bg-secondary/40 transition-colors">
              <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant</h3>
              <p className="text-muted-foreground leading-relaxed">
                Built on modern edge infrastructure. Your page loads instantly, anywhere in the world.
              </p>
            </div>
          </div>

          <div className="pt-20 flex flex-col items-center">
            <h2 className={`text-8xl font-normal mb-12 ${fontSerif.className} italic text-primary`}>Ready?</h2>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Link href="/?auth=signup" className="inline-flex items-center gap-2 h-14 px-8 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:translate-y-[-2px] hover:shadow-lg hover:shadow-primary/25 transition-all">
                Claim Username <ArrowRight className="w-5 h-5" />
              </Link>

              <Link href="/demo" className="inline-flex items-center gap-2 h-14 px-8 rounded-full bg-secondary text-secondary-foreground font-bold text-lg border border-border hover:bg-secondary/80 transition-colors">
                <Play className="w-4 h-4 fill-current" /> Try Demo
              </Link>
            </div>

          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
