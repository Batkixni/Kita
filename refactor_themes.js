const fs = require('fs');
const path = require('path');

const themeDir = 'd:/Programming/kita/app/themes';
const files = fs.readdirSync(themeDir);

files.forEach(file => {
    if (file === 'caffeine.css') return;
    if (!file.endsWith('.css')) return;

    const filePath = path.join(themeDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const themeName = path.basename(file, '.css');

    // Special handling for catppuccin: Fix missing hsl() wrapper
    if (file === 'catppuccin.css') {
        // Regex to match: --variable: 123 45% 67%; -> --variable: hsl(123 45% 67%);
        // Only if it doesn't already have hsl or oklch
        content = content.replace(/:\s*(\d+\s+[\d.]+%?\s+[\d.]+%?)(;)/g, ': hsl($1)$2');
        fs.writeFileSync(filePath, content);
        console.log(`Fixed colors in ${file}`);
        return;
    }

    // Standard scoping for others
    let modified = false;

    // Replace :root with .theme-<name>
    if (content.includes(':root')) {
        content = content.replace(/:root\s*\{/, `.theme-${themeName} {`);
        modified = true;
    }

    // Replace .dark with .theme-<name>.dark
    // Note: Use a regex that matches .dark at start of line or with space, to avoid replacing inside comments if any
    if (content.match(/^\.dark\s*\{/m)) {
        content = content.replace(/^\.dark\s*\{/m, `.theme-${themeName}.dark {`);
        modified = true;
    }

    // Remove @theme inline block
    const themeIndex = content.indexOf('@theme inline');
    if (themeIndex !== -1) {
        content = content.substring(0, themeIndex);
        modified = true;
    }

    if (modified) {
        content = content.trim() + '\n';
        fs.writeFileSync(filePath, content);
        console.log(`Refactored ${file}`);
    }
});
