'use client';

import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface CustomModuleProps {
    content: string;
    className?: string;
    isEditable?: boolean;
    w?: number;
    h?: number;
}

const processShortcodes = (text: string, w?: number) => {
    if (!text) return "";

    const escapeHtml = (unsafe: string) => {
        if (!unsafe) return "";
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    // Regex to match {{type key="value" key2="value"}}
    // This is a simple parser, might be fragile with complex nested quotes, but sufficient for this use case.
    return text.replace(/\{\{(\w+)\s+([^}]+)\}\}/g, (match, type, argsString) => {
        const args: Record<string, string> = {};

        // Parse attributes: key="value"
        const attrRegex = /(\w+)="([^"]*)"/g;
        let attrMatch;
        while ((attrMatch = attrRegex.exec(argsString)) !== null) {
            // CRITICAL: Escape values to prevent injection of tags via shortcodes
            args[attrMatch[1]] = escapeHtml(attrMatch[2]);
        }


        if (type === 'project') {
            const { title = 'Project Name', desc = 'Description', link = '#', image = '' } = args;

            // Fix URL
            let finalLink = link;
            if (finalLink !== '#' && !/^https?:\/\//i.test(finalLink)) {
                finalLink = 'https://' + finalLink;
            }

            // Always use a visible thumbnail size, user complained about missing images
            const boxSize = "w-16 h-12";

            // Use flex-shrink-0 on the wrapper
            const linkWrapperClass = "flex-shrink-0 ml-3 transition-transform active:scale-95 decoration-0 no-underline";

            let contentHtml = '';

            if (image) {
                // Image: Fixed size, small radius
                contentHtml = `<img src="${image}" class="${boxSize} rounded-md bg-secondary object-cover border border-border block my-0" alt="${title}" />`;
            } else {
                // Arrow fallback
                contentHtml = `<div class="${boxSize} flex items-center justify-center rounded-md bg-secondary/50 text-muted-foreground group-hover/item:text-foreground text-xl border border-border/50">→</div>`;
            }

            const rightSideHtml = finalLink !== '#'
                ? `<a href="${finalLink}" target="_blank" rel="noopener noreferrer" class="${linkWrapperClass}">${contentHtml}</a>`
                : `<div class="${linkWrapperClass}">${contentHtml}</div>`;

            return `<div class="flex items-center justify-between p-3 -mx-2 rounded-xl transition-colors group/item hover:bg-accent/50 border border-transparent hover:border-border/50 my-1 overflow-hidden">
                <div class="flex-1 min-w-0 pr-2">
                    <h3 class="font-bold text-foreground text-sm truncate leading-tight m-0">${title}</h3>
                    <p class="text-xs text-muted-foreground truncate m-0 mt-1 opacity-80">${desc}</p>
                </div>
                ${rightSideHtml}
            </div>`;
        }

        if (type === 'social') {
            const { platform = '', user = '', link = '#', title = '', videos = '', subs = '' } = args;

            if (platform === 'github') {
                return `<div class="p-4 rounded-3xl bg-[#0d1117] border border-stone-800 text-white flex flex-col gap-4 shadow-xl">
                    <div class="flex items-center gap-3">
                        <div class="bg-white/10 p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xs text-stone-400">github.com</span>
                            <span class="font-bold text-sm text-stone-200">${title || user + ' – Overview'}</span>
                        </div>
                    </div>
                    <div class="w-full overflow-hidden rounded-lg bg-white/5 p-2">
                        <img src="https://ghchart.rshah.org/00aa00/${user}" alt="Github Contributions" class="w-full h-auto min-w-[300px] object-cover mix-blend-screen opacity-90" />
                    </div>
                </div>`;
            }

            if (platform === 'youtube') {
                // Parse video images: comma separated
                const videoList = videos.split(',').map(v => v.trim()).filter(Boolean).slice(0, 4);
                const videoGrid = videoList.map(v => `
                    <div class="aspect-video rounded-md overflow-hidden bg-black/50 border border-white/10 relative group/vid">
                        <img src="${v}" class="w-full h-full object-cover opacity-80 group-hover/vid:opacity-100 transition-opacity" />
                    </div>
                `).join('');

                // Fill remaining spots with placeholders if needed (for 2x2 grid)
                const filler = Array(Math.max(0, 4 - videoList.length)).fill(0).map(() => `
                    <div class="aspect-video rounded-md overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
                        <span class="text-[10px] text-white/20">Video</span>
                    </div>
                `).join('');

                return `<div class="p-4 rounded-3xl bg-[#3f2022] border border-red-900/30 text-white flex gap-4 shadow-xl overflow-hidden relative">
                    <div class="flex flex-col justify-between z-10 min-w-[100px]">
                        <div>
                             <div class="bg-red-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-red-900/50">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                            </div>
                            <h3 class="text-lg font-bold text-red-50 relative inline-block decoration-wavy underline decoration-red-400/50 mb-0.5">${title || user}</h3>
                            <p class="text-xs text-red-200/50 font-medium">youtube.com</p>
                        </div>
                        <div class="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full w-fit shadow-lg shadow-red-900/20">
                            Subscribe ${subs}
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-2 flex-1 z-10">
                        ${videoGrid}
                        ${filler}
                    </div>
                    <!-- Background Gloss -->
                    <div class="absolute -top-10 -right-10 w-64 h-64 bg-red-500/10 blur-3xl rounded-full pointer-events-none"></div>
                </div>`;
            }
        }

        if (type === 'metric') {
            const { label = 'Label', value = '0', unit = '' } = args;
            return `<div class="flex flex-col"><p class="text-[10px] uppercase tracking-wider text-muted-foreground font-bold m-0 mb-1">${label}</p><div class="flex items-baseline gap-1"><h2 class="text-4xl font-black text-foreground tracking-tight m-0 leading-none">${value}</h2>${unit ? `<span class="text-sm text-muted-foreground font-medium">${unit}</span>` : ''}</div></div>`;
        }

        if (type === 'badge') {
            const { text = 'Badge', color = 'stone' } = args;
            // Map simple color names to tailwind classes
            // Map simple color names to tailwind classes
            // Using semantic/secondary colors to ensure contrast across all themes
            const colors: Record<string, string> = {
                blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
                green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
                yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
                red: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
                stone: 'bg-secondary text-secondary-foreground border-border',
                black: 'bg-primary text-primary-foreground border-primary',
            };
            const colorClass = colors[color] || colors.stone;

            return `<span class="inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${colorClass} mr-2 mb-2 last:mr-0">${text}</span>`;
        }

        if (type === 'tip') {
            const { count = '0', label = 'Tips' } = args;
            return `<div class="flex items-center justify-between p-2"><div><p class="text-[10px] uppercase tracking-widest text-muted-foreground font-bold m-0 mb-1">Total View</p><h2 class="text-3xl font-black text-foreground m-0 leading-none">${count}</h2><p class="text-xs text-muted-foreground m-0 mt-1">${label}</p></div><button class="bg-primary text-primary-foreground px-4 py-2 rounded-full text-xs font-bold hover:scale-105 transition-transform">Support ▼</button></div>`;
        }

        if (type === 'profile') {
            const { name = 'Name', badges = '', desc = 'Description', link = '#', linkText = 'View Profile', socials = '' } = args;
            const badgeList = badges.split(',').map(b => b.trim()).filter(Boolean);
            const badgeHtml = badgeList.map(b => {
                let content = b;
                if (b.toLowerCase().includes('pro')) {
                    content = `<span class="mr-1 text-yellow-500">♛</span>${b}`;
                }
                return `<span class="px-3 py-1 rounded-full border border-border text-xs font-medium text-foreground/80 bg-background/50 backdrop-blur-sm self-start">${content}</span>`;
            }).join('');

            // Process social links: "twitter:url, github:url"
            const socialLinks = socials.split(',').map(s => s.trim()).filter(Boolean);
            const socialHtml = socialLinks.map(s => {
                // simple parser: platform:url or just url (auto-detect?)
                // Let's assume input is just URLs or "Platform: URL"
                // For simplicity, let's try to detect from URL first.
                let url = s;
                let icon = '';

                if (s.includes('twitter.com') || s.includes('x.com')) {
                    icon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>`;
                } else if (s.includes('github.com')) {
                    icon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 4 1 9 2-2.8 1.5-6.6 2.6-9 4.3-.25 1.74-.25 3.47 0 5.2 2.37 1.7 6.47 1.25 9.03 4.25.9 4.25.9 5.5 2 6 5.5.07 1.25-.26 2.48-1 3.5v4"></path></svg>`;
                } else if (s.includes('linkedin.com')) {
                    icon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>`;
                } else if (s.includes('instagram.com')) {
                    icon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>`;
                } else {
                    // Generic link icon
                    icon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`;
                }

                if (!url.startsWith('http')) url = 'https://' + url;

                return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="p-2 rounded-full border border-border bg-background/50 hover:bg-background hover:scale-110 transition-all text-muted-foreground hover:text-foreground">${icon}</a>`;
            }).join('');


            return `<div class="flex flex-col h-full justify-between p-5 relative overflow-hidden group bg-background/50 rounded-3xl border border-border/50"><div class="absolute -top-20 -right-20 w-48 h-48 bg-primary/20 blur-3xl rounded-full pointer-events-none transition-all duration-500 group-hover:bg-primary/30"></div><div class="absolute -bottom-20 -left-20 w-48 h-48 bg-accent/20 blur-3xl rounded-full pointer-events-none transition-all duration-500 group-hover:bg-accent/30"></div><div class="relative z-10 flex flex-col gap-4"><div class="flex justify-between items-start"><h1 class="text-4xl font-black text-foreground tracking-tight leading-none">${name}</h1><div class="flex gap-1 flex-wrap justify-end max-w-[40%]">${badgeHtml}</div></div><p class="text-sm text-muted-foreground leading-relaxed font-medium m-0 line-clamp-3">${desc}</p><div class="flex gap-2 mt-1">${socialHtml}</div></div><div class="relative z-10 mt-auto pt-4 border-t border-border/50 flex justify-between items-center"><span class="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">Portfolio</span><a href="${link}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-xs font-bold text-foreground hover:text-primary transition-colors no-underline group/link">${linkText} <span class="ml-1 transition-transform group-hover/link:translate-x-1">→</span></a></div></div>`;
        }

        return match;
    });
};

export function CustomModule({ content, className, isEditable, w, h }: CustomModuleProps) {
    if (!content) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-stone-300 p-4">
                <span className="text-xs font-mono">Empty Custom Module</span>
            </div>
        );
    }

    // Process shortcodes before rendering markdown
    // This allows the shortcodes to expand into HTML, which rehype-raw then handles
    const processedContent = processShortcodes(content, w);

    return (
        <div className={cn(
            "w-full h-full relative custom-markdown p-4 prose prose-sm max-w-none prose-stone dark:prose-invert break-words leading-normal",
            isEditable ? "overflow-hidden" : "overflow-y-auto",
            className
        )}>
            {/* Overlay for dragging in Edit Mode */}
            {isEditable && (
                <div className="absolute inset-0 z-10 bg-transparent cursor-grab active:cursor-grabbing" />
            )}

            <ReactMarkdown
                rehypePlugins={[
                    rehypeRaw,
                    [rehypeSanitize, {
                        attributes: {
                            '*': ['className', 'class'],
                            a: ['href', 'target', 'rel'],
                            img: ['src', 'alt', 'width', 'height'],
                            svg: ['xmlns', 'width', 'height', 'viewBox', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin'],
                            path: ['d'],
                            rect: ['width', 'height', 'x', 'y', 'rx', 'ry'],
                            circle: ['cx', 'cy', 'r'],
                            line: ['x1', 'x2', 'y1', 'y2'],
                        },
                        tagNames: ['div', 'span', 'p', 'a', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'strong', 'em', 'del', 'br', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'svg', 'path', 'rect', 'circle', 'line', 'button'], // Allow SVG for icons and button for tip
                    }]
                ]}
                remarkPlugins={[remarkGfm]}
                components={{
                    // Override default element styles if needed, or rely on Tailwind utility classes in HTML
                    // We keep it minimal to allow user full control via class=""
                }}
            >
                {processedContent}
            </ReactMarkdown>
        </div>
    );
}
