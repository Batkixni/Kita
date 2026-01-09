"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Playfair_Display } from "next/font/google"; // Import Serif Font

const fontSerif = Playfair_Display({ subsets: ["latin"], weight: ["400", "900"], style: ["normal", "italic"] });

const MAIN_NAMES = ["adeline", "marcus", "sarah", "david", "jessica", "alex", "ryan", "lucas"];

export function UniqueLinkSection() {
    const [nameIndex, setNameIndex] = useState(0);

    // Cycle through names every 1.5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setNameIndex((prev) => (prev + 1) % MAIN_NAMES.length);
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative w-full min-h-[60vh] flex flex-col items-center justify-center overflow-hidden bg-background py-32">

            {/* Header */}
            <div className="relative z-20 text-center mb-20 px-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-6xl md:text-8xl font-black tracking-tighter mb-4"
                >
                    Your <span className={`${fontSerif.className} italic font-normal text-muted-foreground`}>unique</span> link.
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-2xl text-muted-foreground font-medium"
                >
                    And btw, the good ones are still free.
                </motion.p>
            </div>

            {/* Central Focus (Animated) */}
            <div className="relative z-10 flex items-center justify-center gap-1 text-5xl md:text-[7rem] font-bold select-none leading-none">
                <span className="text-muted-foreground/30">kita.zone/</span>
                <div className={`relative min-w-[300px] text-left ${fontSerif.className}`}>
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={MAIN_NAMES[nameIndex]}
                            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                            transition={{ duration: 0.3 }}
                            className="block text-foreground italic font-normal py-2"
                        >
                            {MAIN_NAMES[nameIndex]}
                        </motion.span>
                    </AnimatePresence>
                    {/* Underline decoration */}
                    <motion.div
                        layoutId="underline"
                        className="absolute bottom-4 left-0 w-full h-3 bg-primary/20 rounded-full"
                    />
                </div>
            </div>

        </section>
    );
}
