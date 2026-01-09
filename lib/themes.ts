
export interface Theme {
    id: string;
    name: string;
    colors: {
        background: string | null;
    };
    radius: string;
}

export const THEMES: Theme[] = [
    { id: 'default', name: 'Default (Stone)', colors: { background: '#fafaf9' }, radius: '3xl' },
    { id: 'dark', name: 'Dark Mode', colors: { background: null }, radius: '3xl' },

    // Neutrals
    { id: 'zinc', name: 'Zinc', colors: { background: '#fafafa' }, radius: 'md' },
    { id: 'slate', name: 'Slate', colors: { background: '#f8fafc' }, radius: 'md' },
    { id: 'gray', name: 'Gray', colors: { background: '#f9fafb' }, radius: 'md' },
    { id: 'neutral', name: 'Neutral', colors: { background: '#fafafa' }, radius: 'md' },

    // Colorful
    { id: 'red', name: 'Red', colors: { background: '#fef2f2' }, radius: 'lg' },
    { id: 'rose', name: 'Rose', colors: { background: '#fff1f2' }, radius: 'lg' },
    { id: 'orange', name: 'Orange', colors: { background: '#fff7ed' }, radius: 'lg' },
    { id: 'green', name: 'Green', colors: { background: '#f0fdf4' }, radius: 'lg' },
    { id: 'blue', name: 'Blue', colors: { background: '#eff6ff' }, radius: 'lg' },
    { id: 'yellow', name: 'Yellow', colors: { background: '#fefce8' }, radius: 'lg' },
    { id: 'violet', name: 'Violet', colors: { background: '#f5f3ff' }, radius: 'lg' },

    // Stylized
    { id: 'midnight', name: 'Midnight', colors: { background: '#1e1b4b' }, radius: 'xl' },
    { id: 'forest', name: 'Forest', colors: { background: '#022c22' }, radius: '2xl' },
];
