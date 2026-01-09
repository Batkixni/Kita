'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveLeft, Ghost } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 overflow-hidden relative">
            {/* Background Decor */}
            <div className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(#888 1px, transparent 1px), linear-gradient(to right, #888 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            ></div>

            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">

                {/* 404 Big Block */}
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="md:col-span-2 lg:col-span-2 bg-foreground text-background rounded-3xl p-12 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <h1 className="text-[120px] md:text-[180px] font-black leading-none tracking-tighter opacity-90 select-none">
                        404
                    </h1>
                    <p className="text-xl md:text-2xl font-medium opacity-80 mt-[-10px]">
                        Oops! Looks like this bento box is empty.
                    </p>
                </motion.div>

                {/* Decor Block 1: Ghost Icon */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-muted rounded-3xl p-8 flex items-center justify-center aspect-square shadow-inner"
                >
                    <Ghost className="w-24 h-24 text-muted-foreground/20 animate-bounce-slow" strokeWidth={1} />
                </motion.div>

                {/* Decor Block 2: Message */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-primary/5 border border-primary/10 rounded-3xl p-8 flex flex-col justify-center gap-4 relative overflow-hidden"
                >
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
                    <p className="text-lg font-medium text-muted-foreground relative z-10">
                        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                    </p>
                </motion.div>

                {/* Navigation Block */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="md:col-span-2 bg-background border border-border rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-primary/50 transition-colors shadow-sm"
                >
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold mb-2">Lost in the grid?</h3>
                        <p className="text-muted-foreground">Let's get you back to creating something amazing.</p>
                    </div>

                    <Link href="/">
                        <Button size="lg" className="rounded-full px-8 h-14 text-base font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                            <MoveLeft className="mr-2 h-5 w-5" />
                            Return Home
                        </Button>
                    </Link>
                </motion.div>

            </div>
        </div>
    );
}
