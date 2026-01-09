'use client';

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

import { forwardRef } from "react";

// Basic Grid Item Card Style
interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    transparent?: boolean;
    radius?: string;
}

export const GridItem = ({ children, className, transparent, radius = '3xl', ...props }: GridItemProps) => {
    // Map radius to tailwind classes
    // Note: Tailwind v3 needs full class names to safeguard against purging, 
    // but standard classes like rounded-md, rounded-xl usually exist.
    // If strict safelist is needed, we prefer style or exact map.

    const radiusMap: Record<string, string> = {
        'none': 'rounded-none',
        'sm': 'rounded-sm',
        'md': 'rounded-md',
        'lg': 'rounded-lg',
        'xl': 'rounded-xl',
        '2xl': 'rounded-2xl',
        '3xl': 'rounded-3xl',
    };

    // Default to 3xl if unknown
    const radiusClass = radiusMap[radius] || 'rounded-3xl';

    return (
        <div
            className={cn(
                "h-full w-full overflow-hidden transition-all duration-300",
                !transparent && `bg-card text-card-foreground shadow-xs border border-border hover:shadow-sm hover:border-primary/20 ${radiusClass}`,
                transparent && "rounded-none", // Transparent modules don't need radius usually, or handled internally
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
