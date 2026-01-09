'use server';

import fs from 'fs/promises';
import path from 'path';

export interface ThemeFile {
    id: string;
    name: string;
}

export async function getAvailableThemes(): Promise<ThemeFile[]> {
    try {
        const themesDir = path.join(process.cwd(), 'app', 'themes');

        // Ensure directory exists
        try {
            await fs.access(themesDir);
        } catch {
            return [];
        }

        const files = await fs.readdir(themesDir);
        const cssFiles = files.filter(file => file.endsWith('.css'));

        return cssFiles.map(file => {
            const id = file.replace('.css', '');
            // Capitalize first letter for display name
            const name = id.charAt(0).toUpperCase() + id.slice(1);
            return {
                id,
                name
            };
        });
    } catch (error) {
        console.error("Failed to list themes:", error);
        return [];
    }
}
