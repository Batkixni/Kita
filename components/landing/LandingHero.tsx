'use client';

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { HeroModule } from "./HeroModule";
import { Twitter, Globe, Github, Music, Quote } from "lucide-react";
import Link from "next/link";
import { LandingThemeSwitcher } from "./LandingThemeSwitcher";

export function LandingHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    // Grid Origin (0,0) will be "Center of the Viewport"
    // We shift the whole grid DOWN by 100px to make room for the "Everything you need" text.
    const GRID_Y_OFFSET = 100;
    const G_W = 300;
    const G_H = 300;

    // Faster Animation: Completes earlier
    const ANIM_DURATION = 0.5;

    // Initial Blur Entry (Page Load)
    const blurEntry = {
        hidden: { opacity: 0, filter: "blur(10px)", scale: 0.9 },
        visible: { opacity: 1, filter: "blur(0px)", scale: 1 },
    };

    return (
        <div ref={containerRef} className="h-[250vh] relative">

            {/* Sticky Viewport */}
            <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center bg-background">

                {/* Background Grid */}
                <div className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, #333 1px, transparent 1px),
                            linear-gradient(to bottom, #333 1px, transparent 1px)
                        `,
                        backgroundSize: '50px 50px',
                        maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
                    }}
                />

                {/* Navbar */}
                <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
                    <motion.div
                        initial="hidden" animate="visible" variants={blurEntry} transition={{ duration: 0.8 }}
                        className="flex items-center gap-2 font-bold text-xl"
                    >
                        <div className="w-8 h-8 bg-primary rounded-lg" />
                        Kita
                    </motion.div>
                    <motion.div
                        initial="hidden" animate="visible" variants={blurEntry} transition={{ duration: 0.8, delay: 0.1 }}
                        className="flex items-center gap-4"
                    >
                        <LandingThemeSwitcher />
                        <Link href="/sign-in" className="text-sm font-bold hover:text-primary transition-colors">Login</Link>
                        <Link href="/sign-up" className="px-5 py-2.5 bg-foreground text-background rounded-full text-sm font-bold hover:opacity-90 transition-opacity">
                            Get Started
                        </Link>
                    </motion.div>
                </header>

                <div className="relative w-full max-w-7xl h-full flex flex-col items-center justify-center">

                    {/* --- TITLE PHASE --- */}
                    <motion.div
                        className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none"
                        style={{
                            opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]), // Fades out faster
                            y: useTransform(scrollYProgress, [0, 0.25], [0, -400]),
                            scale: useTransform(scrollYProgress, [0, 0.25], [1, 0.8]),
                        }}
                    >
                        <motion.div initial="hidden" animate="visible" variants={blurEntry} transition={{ duration: 1 }}>
                            <h1 className="text-8xl md:text-9xl font-black tracking-tighter leading-[0.9] text-center">
                                Your <span className="text-muted-foreground">Corner</span> <br />
                                of the <span className="text-primary">Internet.</span>
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-lg mx-auto mt-8 font-medium text-center">
                                The all-in-one personal page builder.
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* --- GRID PHASE --- */}
                    <motion.div
                        className="absolute top-[10vh] flex flex-col items-center z-20 pointer-events-none"
                        style={{
                            opacity: useTransform(scrollYProgress, [0.25, 0.4], [0, 1]), // Fades in earlier
                        }}
                    >
                        <h2 className="text-5xl font-bold mb-4 tracking-tight">Everything you need.</h2>
                        <p className="text-muted-foreground max-w-lg text-lg text-center">
                            Links, photos, code, and more. <br /> unified in one beautiful space.
                        </p>
                    </motion.div>


                    {/* THE BENTO GRID CONTAINER */}
                    <div className="relative w-[900px] h-[600px] mt-[20vh]">

                        {/* 1. PROFILE (Top Center) - Exact replica of CustomModule {{profile}} */}
                        <HeroModule
                            initial="hidden" animate="visible" variants={blurEntry} transition={{ duration: 0.8, delay: 0.1 }}
                            style={{
                                top: 0, left: "50%", marginLeft: -140,
                                x: useTransform(scrollYProgress, [0, ANIM_DURATION], [-300, 0]),
                                y: useTransform(scrollYProgress, [0, ANIM_DURATION], [-250, 0]),
                                rotate: useTransform(scrollYProgress, [0, ANIM_DURATION], [-15, 0]),
                            }}
                            className="w-[280px] h-[280px] z-30 overflow-hidden"
                        >
                            <div className="flex flex-col h-full justify-between p-5 relative overflow-hidden group bg-background/50">
                                <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/10 blur-3xl rounded-full pointer-events-none group-hover:bg-blue-500/20 transition-all duration-500"></div>
                                <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-yellow-500/10 blur-3xl rounded-full pointer-events-none group-hover:bg-yellow-500/20 transition-all duration-500"></div>

                                <div className="relative z-10 flex flex-col gap-4">
                                    <div className="flex justify-between items-start">
                                        <h1 className="text-4xl font-black text-foreground tracking-tight leading-none">Kita</h1>
                                        <div className="flex gap-1 flex-wrap justify-end max-w-[40%]">
                                            <span className="px-3 py-1 rounded-full border border-border text-xs font-medium text-foreground/80 bg-background/50 backdrop-blur-sm self-start">
                                                <span className="mr-1 text-yellow-500">♛</span>Pro
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-muted-foreground leading-relaxed font-medium m-0 line-clamp-3">
                                        Digital creator, developer, and designer building things for the web.
                                    </p>

                                    <div className="flex gap-2 mt-1">
                                        <div className="p-2 rounded-full border border-border bg-background/50 hover:bg-background transition-all text-muted-foreground hover:text-foreground">
                                            <Twitter className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="p-2 rounded-full border border-border bg-background/50 hover:bg-background transition-all text-muted-foreground hover:text-foreground">
                                            <Github className="w-3.5 h-3.5" />
                                        </div>
                                    </div>
                                </div>

                                <div className="relative z-10 mt-auto pt-4 border-t border-border/50 flex justify-between items-center">
                                    <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">Portfolio</span>
                                    <a href="#" className="inline-flex items-center text-xs font-bold text-foreground hover:text-primary transition-colors no-underline group/link">
                                        kita.zone/me <span className="ml-1 transition-transform group-hover/link:translate-x-1">→</span>
                                    </a>
                                </div>
                            </div>
                        </HeroModule>

                        {/* 2. SPOTIFY -> Replaced with LinkModule Style */}
                        <HeroModule
                            initial="hidden" animate="visible" variants={blurEntry} transition={{ duration: 0.8, delay: 0.2 }}
                            style={{
                                top: 20, left: 0,
                                x: useTransform(scrollYProgress, [0, ANIM_DURATION], [-200, 0]),
                                y: useTransform(scrollYProgress, [0, ANIM_DURATION], [100, 0]),
                                rotate: useTransform(scrollYProgress, [0, ANIM_DURATION], [-10, 0]),
                            }}
                            className="w-[260px] h-[260px] z-20"
                        >
                            {/* LinkModule Look */}
                            <div className="flex flex-col h-full w-full group bg-card overflow-hidden text-left p-4 hover:bg-accent/50 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                    <img src="https://www.google.com/s2/favicons?domain=spotify.com&sz=32" alt="" className="w-5 h-5 rounded-full" />
                                    <span className="text-xs text-muted-foreground font-medium">spotify.com</span>
                                </div>
                                <h3 className="font-bold text-card-foreground text-sm leading-snug mb-3 group-hover:text-primary transition-colors">
                                    Canvas - Single by Kita
                                </h3>
                                <div className="flex-1 w-full relative overflow-hidden rounded-xl bg-black border border-border/50">
                                    <div className="absolute inset-0 flex items-center justify-center text-green-500">
                                        <Music className="w-12 h-12" />
                                    </div>
                                </div>
                            </div>
                        </HeroModule>

                        {/* 3. TWITTER -> Replaced with LinkModule Style */}
                        <HeroModule
                            initial="hidden" animate="visible" variants={blurEntry} transition={{ duration: 0.8, delay: 0.2 }}
                            style={{
                                top: 20, right: 0,
                                x: useTransform(scrollYProgress, [0, ANIM_DURATION], [250, 0]),
                                y: useTransform(scrollYProgress, [0, ANIM_DURATION], [-150, 0]),
                                rotate: useTransform(scrollYProgress, [0, ANIM_DURATION], [10, 0]),
                            }}
                            className="w-[260px] h-[260px] z-20"
                        >
                            <div className="flex flex-col h-full w-full group bg-card overflow-hidden text-left p-4 hover:bg-accent/50 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                    <img src="https://www.google.com/s2/favicons?domain=twitter.com&sz=32" alt="" className="w-5 h-5 rounded-full" />
                                    <span className="text-xs text-muted-foreground font-medium">twitter.com</span>
                                </div>
                                <h3 className="font-bold text-card-foreground text-sm leading-snug mb-3 group-hover:text-primary transition-colors">
                                    Check out the latest updates on X
                                </h3>
                                <div className="flex-1 w-full relative overflow-hidden rounded-xl bg-blue-500/10 border border-border/50 flex items-center justify-center">
                                    <Twitter className="w-12 h-12 text-[#1DA1F2]" />
                                </div>
                            </div>
                        </HeroModule>

                        {/* 4. MAP -> LinkModule Style */}
                        <HeroModule
                            initial="hidden" animate="visible" variants={blurEntry} transition={{ duration: 0.8, delay: 0.3 }}
                            style={{
                                bottom: 0, left: 20,
                                x: useTransform(scrollYProgress, [0, ANIM_DURATION], [-150, 0]),
                                y: useTransform(scrollYProgress, [0, ANIM_DURATION], [200, 0]),
                                rotate: useTransform(scrollYProgress, [0, ANIM_DURATION], [-5, 0]),
                            }}
                            className="w-[260px] h-[260px] z-20"
                        >
                            <div className="flex flex-col h-full w-full group bg-card overflow-hidden text-left p-4 hover:bg-accent/50 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                    <img src="https://www.google.com/s2/favicons?domain=maps.google.com&sz=32" alt="" className="w-5 h-5 rounded-full" />
                                    <span className="text-xs text-muted-foreground font-medium">maps.google.com</span>
                                </div>
                                <h3 className="font-bold text-card-foreground text-sm leading-snug mb-3 group-hover:text-primary transition-colors">
                                    Tokyo, Japan
                                </h3>
                                <div className="flex-1 w-full relative overflow-hidden rounded-xl bg-muted border border-border/50">
                                    <Globe className="absolute inset-0 m-auto w-12 h-12 text-muted-foreground opacity-50" />
                                </div>
                            </div>
                        </HeroModule>

                        {/* 5. IMAGE -> Replaced Quote (Editor Style) */}
                        <HeroModule
                            initial="hidden" animate="visible" variants={blurEntry} transition={{ duration: 0.8, delay: 0.4 }}
                            style={{
                                bottom: -20, left: "50%", marginLeft: -140, // Centered
                                x: useTransform(scrollYProgress, [0, ANIM_DURATION], [0, 0]),
                                y: useTransform(scrollYProgress, [0, ANIM_DURATION], [300, 0]),
                                scale: useTransform(scrollYProgress, [0, ANIM_DURATION], [0.8, 1]),
                                rotate: useTransform(scrollYProgress, [0, ANIM_DURATION], [5, 0]),
                            }}
                            className="w-[280px] h-[260px] z-10"
                        >
                            <div className="w-full h-full relative overflow-hidden rounded-3xl">
                                <img
                                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                    alt="Abstract"
                                />
                                <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-md p-3 rounded-xl border border-white/10">
                                    <p className="text-xs text-white/90 font-medium">"Simplicity is the ultimate sophistication."</p>
                                </div>
                            </div>
                        </HeroModule>

                        {/* 6. GITHUB -> LinkModule Style */}
                        <HeroModule
                            initial="hidden" animate="visible" variants={blurEntry} transition={{ duration: 0.8, delay: 0.3 }}
                            style={{
                                bottom: 0, right: 20,
                                x: useTransform(scrollYProgress, [0, ANIM_DURATION], [200, 0]),
                                y: useTransform(scrollYProgress, [0, ANIM_DURATION], [250, 0]),
                                rotate: useTransform(scrollYProgress, [0, ANIM_DURATION], [8, 0]),
                            }}
                            className="w-[260px] h-[260px] z-20"
                        >
                            <div className="flex flex-col h-full w-full group bg-card overflow-hidden text-left p-4 hover:bg-accent/50 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                    <img src="https://www.google.com/s2/favicons?domain=github.com&sz=32" alt="" className="w-5 h-5 rounded-full invert dark:invert-0" />
                                    <span className="text-xs text-muted-foreground font-medium">github.com</span>
                                </div>
                                <h3 className="font-bold text-card-foreground text-sm leading-snug mb-3 group-hover:text-primary transition-colors">
                                    kita-dev/kita
                                </h3>
                                <div className="flex-1 w-full relative overflow-hidden rounded-xl bg-zinc-900 border border-border/50 flex items-center justify-center text-white">
                                    <Github className="w-12 h-12" />
                                </div>
                            </div>
                        </HeroModule>

                    </div>
                </div>
            </div>
        </div>
    );
}
