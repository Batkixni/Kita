// This component is now deprecated or should be used differently. 
// For now, we disable its global side-effect to prevent it from incorrectly stripping 'dark' class from html
// when the user chooses a light background for their PROFILE page.
// The Profile Page should handle its own local theme isolation.
export function ThemeSynchronizer({ isDarkMode }: { isDarkMode?: boolean }) {
    // Intentionally doing nothing to avoid global state pollution.
    // The App is Dark Mode by default (layout.tsx).
    // User pages will override variables locally / inline.
    return null;
}
