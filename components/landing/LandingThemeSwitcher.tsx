'use client';

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { getAvailableThemes, ThemeFile } from "@/actions/themes";

export function LandingThemeSwitcher() {
    // We'll use the same theme logic as the app, but exposing it here
    // In a real scenario, this might just update a context that the LandingHero listens to.
    // However, since our global theme system uses CSS classes on the body/html or specific wrappers,
    // we can reuse the `next-themes` provider if configured, or just manually toggle classes on the landing wrapper.

    // Assuming layout.tsx wraps everything in a ThemeProvider that handles `class` attribute.
    // But our `themes` system is a bit custom, involving `theme-[name]` classes.
    // Let's hook into that.

    const [themes, setThemes] = useState<ThemeFile[]>([]);

    useEffect(() => {
        getAvailableThemes().then(setThemes);
    }, []);

    const setTheme = (themeId: string) => {
        // Remove existing theme classes
        const classList = document.documentElement.classList;
        classList.forEach(c => {
            if (c.startsWith('theme-')) classList.remove(c);
        });

        if (themeId !== 'default') {
            classList.add(`theme-${themeId}`);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full bg-background/50 backdrop-blur-md">
                    <Palette className="w-5 h-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background/80 backdrop-blur-xl border-border/50">
                <DropdownMenuItem onClick={() => setTheme('default')}>
                    Default
                </DropdownMenuItem>
                {themes.map(t => (
                    <DropdownMenuItem key={t.id} onClick={() => setTheme(t.id)}>
                        {t.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
