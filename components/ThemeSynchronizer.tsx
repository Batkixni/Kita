'use client';

import { useEffect } from 'react';

export function ThemeSynchronizer({ isDarkMode }: { isDarkMode?: boolean }) {
    useEffect(() => {
        const root = window.document.documentElement;

        if (isDarkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        // Cleanup isn't strictly necessary as this runs on every render/change,
        // but decent practice to avoid stale state if component unmounts? 
        // Actually, if we navigate away, we might want to reset to default (Dark), 
        // but for now let's just let the next page handle it.
    }, [isDarkMode]);

    return null;
}
