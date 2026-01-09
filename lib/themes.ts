export interface Theme {
    id: string;
    name: string;
    colors: {
        background: string | null;
    };
    radius: string;
    cssClass?: string; // Optional class to apply to body/main
}

export const THEMES: Theme[] = [
    { id: 'default', name: 'Default (Light)', colors: { background: 'oklch(1.00 0 0)' }, radius: '0.625rem' },
    { id: 'dark', name: 'Dark Mode', colors: { background: null }, radius: '0.625rem' },
];
