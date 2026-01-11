'use client';

import { useState, useEffect, useCallback } from "react";
import { ArrowRight, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface ProjectCardItem {
    title: string;
    desc: string;
    link?: string;
    image?: string;
}

interface ProjectCardModuleProps {
    projects: ProjectCardItem[];
    className?: string;
}

export function ProjectCardModule({ projects = [], className }: ProjectCardModuleProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Filter out empty projects if any
    const validProjects = projects.filter(p => p.title);
    const hasMultiple = validProjects.length > 1;

    // Auto-scroll logic
    useEffect(() => {
        if (!hasMultiple || isPaused) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % validProjects.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [hasMultiple, isPaused, validProjects.length]);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % validProjects.length);
    }, [validProjects.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + validProjects.length) % validProjects.length);
    }, [validProjects.length]);

    if (validProjects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-6 bg-muted/20 border border-dashed border-border rounded-xl text-center text-muted-foreground">
                <p>No projects added yet.</p>
            </div>
        );
    }

    const currentProject = validProjects[currentIndex];

    return (
        <div
            className={cn("flex flex-col h-full w-full bg-background border border-border overflow-hidden group relative", className)}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Image Section (16:9ish aspect ratio, but fills top) */}
            <div className="relative w-full aspect-video bg-muted overflow-hidden">
                {currentProject.image ? (
                    <img
                        src={currentProject.image}
                        alt={currentProject.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary/50 text-muted-foreground font-mono text-xs">
                        NO PREVIEW
                    </div>
                )}

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />

                {/* Navigation Arrows (Only show if multiple) */}
                {hasMultiple && (
                    <>
                        <button
                            onClick={(e) => { e.preventDefault(); prevSlide(); }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm hover:bg-black/70"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => { e.preventDefault(); nextSlide(); }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm hover:bg-black/70"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </>
                )}

                {/* Dots Indicator */}
                {hasMultiple && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                        {validProjects.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => { e.preventDefault(); setCurrentIndex(idx); }}
                                className={cn(
                                    "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                    idx === currentIndex ? "bg-white w-3" : "bg-white/40 hover:bg-white/60"
                                )}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="flex-1 p-4 flex flex-col justify-between relative z-10 -mt-2">
                <div className="space-y-2">
                    <h3 className="text-xl font-bold tracking-tight text-foreground line-clamp-1">{currentProject.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {currentProject.desc}
                    </p>
                </div>

                {currentProject.link && (
                    <div className="pt-4 mt-auto">
                        <Button asChild size="sm" variant="outline" className="w-full justify-between group/btn hover:bg-primary/5 hover:text-primary hover:border-primary/20">
                            <a href={currentProject.link} target="_blank" rel="noopener noreferrer">
                                <span className="font-semibold text-xs uppercase tracking-wider">View Project</span>
                                <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                            </a>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
