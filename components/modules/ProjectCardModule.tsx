'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export interface ProjectCardItem {
    title: string;
    desc: string;
    link?: string;
    image?: string;
}

interface ProjectCardModuleProps {
    projects: ProjectCardItem[];
    className?: string;
    theme?: any;
    w?: number;
    h?: number;
}

export function ProjectCardModule({ projects = [], className, theme, w = 4, h = 3 }: ProjectCardModuleProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [direction, setDirection] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Filter out empty projects
    const validProjects = projects.filter(p => p.title);
    const hasMultiple = validProjects.length > 1;

    // Responsive Logic via ResizeObserver for instant feedback
    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setContainerWidth(entry.contentRect.width);
            }
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // Switch layout based on pixel width (e.g., < 500px is stack)
    // Fallback to 'w' prop logic if containerWidth isn't set yet (initial render)
    // Standard grid col ~120px-150px. 4 cols ~ 600px. 
    // Let's say < 520px triggers stack mode.
    const isSmall = containerWidth > 0 ? containerWidth < 520 : w < 4;

    // Auto-scroll logic
    useEffect(() => {
        if (!hasMultiple || isPaused) return;
        const timer = setInterval(() => {
            setDirection(1);
            setCurrentIndex((prev) => (prev + 1) % validProjects.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [hasMultiple, isPaused, validProjects.length]);

    const nextSlide = useCallback(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % validProjects.length);
    }, [validProjects.length]);

    const prevSlide = useCallback(() => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + validProjects.length) % validProjects.length);
    }, [validProjects.length]);

    if (validProjects.length === 0) {
        return (
            <div className="flex items-center justify-center h-full p-6 text-muted-foreground bg-card rounded-3xl border border-dashed">
                <p>No projects.</p>
            </div>
        );
    }

    const currentProject = validProjects[currentIndex];

    // Animation Variants
    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0
        })
    };

    // Calculate dynamic styles
    const radiusStyle = theme?.radius ? { borderRadius: theme.radius } : {};

    return (
        <div
            ref={containerRef}
            className={cn(
                "h-full w-full bg-card text-card-foreground overflow-hidden relative group border border-border shadow-sm",
                className
            )}
            style={{ ...radiusStyle }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* CONTAINER: Flex Column (Stack) or Flex Row (Split) */}
            <div className={cn("flex w-full h-full transition-all duration-300", isSmall ? "flex-col-reverse" : "flex-row")}>

                {/* 1. TEXT CONTENT SECTION */}
                <div
                    className={cn(
                        "relative z-10 flex flex-col justify-between p-6 transition-all duration-300",
                        isSmall ? "w-full h-auto flex-1 border-t border-border/10" : "w-[45%] h-full border-r border-border/10"
                    )}
                >
                    {/* Top: Accent Plus */}
                    <div className="text-primary mb-4">
                        <Plus className="w-6 h-6 opacity-80" />
                    </div>

                    {/* Middle: Title & Meta */}
                    <div className="flex-1 flex flex-col justify-center space-y-3">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-3"
                            >
                                <h2
                                    className={cn(
                                        "font-black uppercase leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary/60 break-words",
                                        isSmall ? "text-4xl" : "text-5xl lg:text-7xl"
                                    )}
                                >
                                    {currentProject.title}
                                </h2>
                                <p className="text-sm text-muted-foreground font-medium line-clamp-3 leading-relaxed">
                                    {currentProject.desc}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Bottom: Action Button & Nav */}
                    <div className="mt-4 flex items-center justify-between">
                        {currentProject.link ? (
                            <a
                                href={currentProject.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center group/btn"
                            >
                                <div className="h-10 w-16 rounded-full bg-primary flex items-center justify-center transition-all duration-300 group-hover/btn:w-24 group-hover/btn:bg-primary/90">
                                    <ArrowRight className="text-primary-foreground w-5 h-5 transform -rotate-45 group-hover/btn:rotate-0 transition-transform duration-300" />
                                </div>
                            </a>
                        ) : <div />}

                        {/* Mini Nav Controls (Mobile/Stack Mode) */}
                        {hasMultiple && isSmall && (
                            <div className="flex gap-2">
                                <button onClick={prevSlide} className="p-2 hover:bg-muted rounded-full transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                                <button onClick={nextSlide} className="p-2 hover:bg-muted rounded-full transition-colors"><ChevronRight className="w-4 h-4" /></button>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. IMAGE SECTION */}
                <div
                    className={cn(
                        "relative overflow-hidden bg-muted",
                        isSmall ? "w-full h-[45%] min-h-[180px]" : "w-[55%] h-full"
                    )}
                >
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 250, damping: 30 },
                                opacity: { duration: 0.3 }
                            }}
                            className="absolute inset-0 w-full h-full"
                        >
                            {currentProject.image ? (
                                <>
                                    <img
                                        src={currentProject.image}
                                        alt={currentProject.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 ring-1 ring-inset ring-black/5" />
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 font-black text-4xl uppercase select-none">
                                    {currentProject.title.slice(0, 2)}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Desktop Nav Controls Over Image (Only in Split Mode) */}
                    {hasMultiple && !isSmall && (
                        <div className="absolute bottom-4 right-4 flex gap-2 z-20">
                            <button
                                onClick={prevSlide}
                                className="w-10 h-10 rounded-full border border-white/20 bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="w-10 h-10 rounded-full border border-white/20 bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
