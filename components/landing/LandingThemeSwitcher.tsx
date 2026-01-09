'use client';

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Palette, Check } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { getAvailableThemes, ThemeFile } from "@/actions/themes";
import { cn } from "@/lib/utils";

// Manual color mapping for visual preview
const THEME_COLORS: Record<string, string> = {
    'default': '#ffffff', // "Black & White" / Default
    'caffeine': '#C89467', // Brown
    'catppuccin': '#F5C2E7', // Pinkish
    'claude': '#D97757', // Burnt Orange
    'code': '#2F81F7', // Blue
    'ghibli': '#89CFF0', // Sky Blue
    'marshmellow': '#FFB7B2', // Soft Red
    'midnight-bloom': '#6F6FD9', // Purple
    'modern': '#A1A1AA', // Grey/Silver
    'pastel-dreams': '#B5EAD7', // Pastel Green
    'slack': '#E01E5A', // Red/Magenta
    'spotify': '#1DB954', // Green
    'sunset': '#F97316', // Orange
};

export function LandingThemeSwitcher() {
    const [themes, setThemes] = useState<ThemeFile[]>([]);
    const [mounted, setMounted] = useState(false);
    const [currentTheme, setCurrentTheme] = useState('default');

    useEffect(() => {
        setMounted(true);
        getAvailableThemes().then(setThemes);

        // Try to detect current theme from class
        const classList = document.documentElement.classList;
        let found = 'default';
        classList.forEach(c => {
            if (c.startsWith('theme-')) found = c.replace('theme-', '');
        });
        setCurrentTheme(found);
    }, []);

    const setTheme = (themeId: string) => {
        const classList = document.documentElement.classList;
        classList.forEach(c => {
            if (c.startsWith('theme-')) classList.remove(c);
        });

        if (themeId !== 'default') {
            classList.add(`theme-${themeId}`);
        }
        setCurrentTheme(themeId);
    };

    if (!mounted) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full w-10 h-10 bg-background/50 backdrop-blur-md border border-border/50 shadow-sm hover:scale-105 transition-transform">
                    <span
                        className="w-4 h-4 rounded-full border border-black/10 dark:border-white/10"
                        style={{
                            backgroundColor: currentTheme === 'default' ? '#ffffff' : (THEME_COLORS[currentTheme] || '#fff'),
                            boxShadow: currentTheme === 'default' ? 'inset 0 0 0 2px #000' : 'none'
                        }}
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[320px] p-4 bg-background/95 backdrop-blur-xl border-border/50 rounded-3xl shadow-2xl">

                <div className="grid grid-cols-5 gap-3">
                    {/* Default Option (B&W) */}
                    <button
                        onClick={() => setTheme('default')}
                        className={cn(
                            "group relative flex flex-col items-center gap-2 outline-none",
                            currentTheme === 'default' ? "opacity-100" : "opacity-60 hover:opacity-100"
                        )}
                    >
                        <div className={cn(
                            "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                            currentTheme === 'default' ? "border-foreground scale-110 shadow-lg" : "border-transparent bg-muted/20 group-hover:scale-110"
                        )}>
                            <div className="w-8 h-8 rounded-full bg-white border border-gray-200" style={{ background: 'linear-gradient(45deg, #000 50%, #fff 50%)' }} />
                        </div>
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-tight opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background px-2 py-1 rounded-full whitespace-nowrap z-50 pointer-events-none">
                            B&W
                        </span>
                    </button>

                    {/* Dynamic Themes */}
                    {themes.filter(t => t.id !== 'modern').map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTheme(t.id)}
                            className={cn(
                                "group relative flex flex-col items-center gap-2 outline-none",
                                currentTheme === t.id ? "opacity-100" : "opacity-60 hover:opacity-100"
                            )}
                        >
                            <div className={cn(
                                "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                                currentTheme === t.id ? "border-foreground scale-110 shadow-lg" : "border-transparent bg-muted/20 group-hover:scale-110"
                            )}>
                                <div
                                    className="w-8 h-8 rounded-full shadow-sm"
                                    style={{ backgroundColor: THEME_COLORS[t.id] || '#eee' }}
                                />
                            </div>
                            {/* Tooltip-ish label */}
                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-tight opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background px-2 py-1 rounded-full whitespace-nowrap z-50 pointer-events-none">
                                {t.name}
                            </span>
                        </button>
                    ))}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
