
interface Theme {
    id: string;
    name: string;
    colors: {
        background: string;
        // future: accent, text, etc.
    };
    radius: string; // 'sm' | 'md' | 'lg' | ...
}

export const THEMES: Theme[] = [
    { id: 'default', name: 'Default', colors: { background: '#fafaf9' }, radius: '3xl' },
    { id: 'dark', name: 'Dark Mode', colors: { background: '#09090b' }, radius: '3xl' },
    { id: 'art-deco', name: 'Art Deco', colors: { background: '#FFF8E1' }, radius: 'none' }, // Example colors
    { id: 'midnight', name: 'Midnight', colors: { background: '#1e1b4b' }, radius: 'xl' },
    { id: 'forest', name: 'Forest', colors: { background: '#ecfdf5' }, radius: '2xl' },
    // ... add more from user request (Caffeine, Claude, etc.) approximation
];
