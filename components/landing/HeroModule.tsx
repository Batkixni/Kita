'use client';

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface HeroModuleProps extends HTMLMotionProps<"div"> {
    children: ReactNode;
    className?: string;
}

export function HeroModule({ children, className, style, ...props }: HeroModuleProps) {
    return (
        <motion.div
            style={style}
            className={cn(
                "absolute rounded-3xl overflow-hidden border border-border/40 bg-card flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow", // Matches real app module style
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}
