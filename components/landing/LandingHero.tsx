'use client';

import { motion } from "framer-motion";
import { HeroModule } from "./HeroModule";
import { Twitter, Globe, Github, Quote, ArrowRight } from "lucide-react";
import Link from "next/link";
import { LandingThemeSwitcher } from "./LandingThemeSwitcher";
import { Playfair_Display } from "next/font/google";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LandingModeToggle } from "@/components/landing/LandingModeToggle";
import { cn } from "@/lib/utils";
import { AuthDialog } from "@/components/auth/AuthDialog";

const fontSerif = Playfair_Display({ subsets: ["latin"], weight: ["400", "900"], style: ["normal", "italic"] });

export function LandingHero() {
    // Simple mount check to avoid hydration mismatch on random values if any
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    // Simple Blur In Animation (One-time, no scroll linkage)
    const fadeInUp = {
        hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
        visible: { opacity: 1, y: 0, filter: "blur(0px)" },
    };

    return (
        <div className="relative min-h-screen bg-background flex flex-col items-center overflow-hidden">

            {/* Dynamic Background */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(#888 1px, transparent 1px), linear-gradient(to right, #888 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* Top Gradient Blob (Theme Reactive) */}
                <div className="absolute -top-[30%] left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-primary/20 blur-[130px] rounded-full mix-blend-screen" />

                {/* Bottom Accent Blob - Now uses Primary too for monochrome consistency, or Accent if defined */}
                <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-primary/10 blur-[100px] rounded-full mix-blend-screen opacity-50" />
            </div>

            {/* 1. NAVBAR - Fixed Top */}
            <header className="w-full max-w-7xl mx-auto p-6 flex justify-between items-center z-50">
                <div className="flex items-center gap-2 font-bold text-2xl tracking-tight">
                    <div className="w-10 h-10 bg-primary/20 text-primary border border-primary/20 rounded-xl flex items-center justify-center">
                        <div className="w-4 h-4 bg-current rounded-sm" />
                    </div>
                    kita
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                    <LandingModeToggle />
                    <LandingThemeSwitcher />

                    <div className="w-px h-6 bg-border mx-2 hidden md:block" />

                    <form action={async () => {
                        'use server';
                        const { startDemo } = await import('@/actions/demo');
                        await startDemo();
                    }}>
                        <Button variant="ghost" className="rounded-full font-semibold text-muted-foreground hover:text-foreground text-sm md:text-base px-2 md:px-4">Try Demo</Button>
                    </form>

                    <div className="hidden md:block">
                        <AuthDialog mode="signin">
                            <Button variant="ghost" className="rounded-full font-semibold">Sign In</Button>
                        </AuthDialog>
                    </div>
                    <AuthDialog mode="signup">
                        <Button className="rounded-full px-4 md:px-6 font-bold shadow-lg shadow-primary/20 text-sm md:text-base">Get Started</Button>
                    </AuthDialog>
                </div>
            </header>

            {/* 2. HERO CONTENT - Centered Title & Subtitle */}
            <main className="flex flex-col items-center w-full max-w-7xl px-6 pt-20 pb-32">

                <motion.div
                    initial="hidden" animate="visible"
                    transition={{ staggerChildren: 0.1 }}
                    className="text-center max-w-4xl mx-auto mb-24"
                >
                    <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/30 text-xs font-semibold uppercase tracking-wider mb-8 text-muted-foreground">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        alpha is now live
                    </motion.div>

                    <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-foreground mb-8">
                        Your <span className={`${fontSerif.className} italic font-normal text-muted-foreground`}>Corner</span> <br />
                        of the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500">Internet.</span>
                    </motion.h1>

                    <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        The all-in-one personal page builder. <br className="hidden md:block" />
                        Showcase your projects, thoughts, and aesthetic in one place.
                    </motion.p>
                </motion.div>


                {/* 3. BENTO GRID - Static, Clean, Responsive */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-5xl mx-auto"
                >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[550px]">

                        {/* LEFT: MAIN PROFILE CARD (Span 7) */}
                        <div className="col-span-1 md:col-span-7 h-[500px] md:h-full relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-indigo-500 rounded-[40px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                            <div className="relative h-full bg-card rounded-[36px] border border-border/50 p-10 flex flex-col justify-between overflow-hidden">

                                {/* Background Decorations */}
                                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 blur-[80px] rounded-full pointer-events-none" />

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center text-4xl border border-border shadow-sm">
                                            👋
                                        </div>
                                        <div className="px-3 py-1 bg-background/50 backdrop-blur border border-border rounded-full text-xs font-bold uppercase tracking-wider">
                                            Portfolio
                                        </div>
                                    </div>
                                    <h2 className="text-5xl font-bold tracking-tight mb-4">Kita</h2>
                                    <p className="text-lg text-muted-foreground">
                                        Digital creator & designer. <br />
                                        Building tools that empower creativity.
                                    </p>
                                </div>

                                <div className="relative z-10 flex gap-4 pt-8 border-t border-border/10">
                                    <button className="flex-1 bg-foreground text-background font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                                        Follow
                                    </button>
                                    <button className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center border border-border hover:bg-muted transition-colors">
                                        <Twitter className="w-6 h-6" />
                                    </button>
                                    <button className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center border border-border hover:bg-muted transition-colors">
                                        <Github className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </div>


                        {/* RIGHT: STACK (Span 5) */}
                        <div className="col-span-1 md:col-span-5 flex flex-col gap-6 h-full">

                            {/* TOP RIGHT: PROJECT */}
                            <div className="flex-1 relative group bg-card rounded-[36px] border border-border/50 p-8 overflow-hidden hover:border-primary/50 transition-colors">
                                <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                                    <ArrowRight className="w-8 h-8 -rotate-45" />
                                </div>
                                <div className="relative z-10 h-full flex flex-col justify-center">
                                    <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center text-2xl mb-4">
                                        🤖
                                    </div>
                                    <h3 className="text-2xl font-bold mb-1">NextAI</h3>
                                    <p className="text-muted-foreground text-sm">Chat with the future.</p>
                                </div>
                            </div>

                            {/* BOTTOM ROW (Split) */}
                            <div className="flex-1 grid grid-cols-2 gap-6">
                                {/* Social Stat */}
                                <div className="bg-[#1DA1F2] rounded-[36px] p-6 flex flex-col items-center justify-center text-white relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <Twitter className="w-8 h-8 mb-3" />
                                    <div className="text-lg font-bold">@kota</div>
                                    <div className="text-xs opacity-80">12k Followers</div>
                                </div>

                                {/* Location */}
                                <div className="bg-card border border-border/50 rounded-[36px] p-6 flex flex-col justify-between relative overflow-hidden group">
                                    <Globe className="w-16 h-16 text-muted/20 absolute -bottom-4 -right-4 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                                    <div className="text-xs font-bold text-emerald-500 uppercase">Base</div>
                                    <div className="text-xl font-bold">Osaka, <br /> JP</div>
                                </div>
                            </div>

                        </div>

                    </div>
                </motion.div>

            </main>
        </div>
    );
}
