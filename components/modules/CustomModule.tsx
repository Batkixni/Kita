'use client';

import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
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

    // Regex to match {{type key="value" key2="value"}}
    // This is a simple parser, might be fragile with complex nested quotes, but sufficient for this use case.
    return text.replace(/\{\{(\w+)\s+([^}]+)\}\}/g, (match, type, argsString) => {
        const args: Record<string, string> = {};

        // Parse attributes: key="value"
        const attrRegex = /(\w+)="([^"]*)"/g;
        let attrMatch;
        while ((attrMatch = attrRegex.exec(argsString)) !== null) {
            args[attrMatch[1]] = attrMatch[2];
        }

        if (type === 'project') {
            const { title = 'Project Name', desc = 'Description', link = '#', image = '' } = args;

            // Fix URL: Prepend https:// if missing and not a simple anchor
            let finalLink = link;
            if (finalLink !== '#' && !/^https?:\/\//i.test(finalLink)) {
                finalLink = 'https://' + finalLink;
            }

            // Responsive sizing based on Grid Unit 'w'
            // If w <= 2 (Small 2x2 or 1x2), use smaller image
            const isSmall = w && w <= 2;
            const boxSize = isSmall ? "w-12 h-12" : "w-24 h-16";

            // Use flex-shrink-0 on the wrapper to prevent shrinking
            const linkWrapperClass = "flex-shrink-0 ml-3 transition-transform active:scale-95 decoration-0 no-underline";

            let contentHtml = '';

            if (image) {
                // Image: Full size, no radius
                contentHtml = `<img src="${image}" class="${boxSize} rounded-none bg-secondary object-cover border border-border block my-0" alt="${title}" />`;
            } else {
                // Arrow: Full size container, centered arrow, no background
                contentHtml = `<div class="${boxSize} flex items-center justify-center rounded-none text-muted-foreground group-hover/item:text-foreground text-2xl">→</div>`;
            }

            const rightSideHtml = finalLink !== '#'
                ? `<a href="${finalLink}" target="_blank" rel="noopener noreferrer" class="${linkWrapperClass}">${contentHtml}</a>`
                : `<div class="${linkWrapperClass}">${contentHtml}</div>`;

            // Container (Text is static, only right side is link if applicable)
            return `<div class="flex items-center justify-between p-3 -mx-2 rounded-xl transition-colors group/item hover:bg-accent/50 border border-transparent hover:border-border my-1 overflow-hidden">
                <div class="flex-1 min-w-0 pr-2">
                    <h3 class="font-bold text-foreground text-sm truncate leading-snug m-0">${title}</h3>
                    <p class="text-xs text-muted-foreground truncate m-0 mt-0.5">${desc}</p>
                </div>
                ${rightSideHtml}
            </div>`;
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


            return `
            <div class="flex flex-col h-full justify-between p-5 relative overflow-hidden group bg-background/50">
                <div class="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/10 blur-3xl rounded-full pointer-events-none transition-all duration-500 group-hover:bg-blue-500/20"></div>
                <div class="absolute -bottom-20 -left-20 w-48 h-48 bg-yellow-500/10 blur-3xl rounded-full pointer-events-none transition-all duration-500 group-hover:bg-yellow-500/20"></div>

                <div class="relative z-10 flex flex-col gap-4">
                    <div class="flex justify-between items-start">
                        <h1 class="text-4xl font-black text-foreground tracking-tight leading-none">${name}</h1>
                        <div class="flex gap-1 flex-wrap justify-end max-w-[40%]">
                             ${badgeHtml}
                        </div>
                    </div>
                    
                    <p class="text-sm text-muted-foreground leading-relaxed font-medium m-0 line-clamp-3">
                        ${desc}
                    </p>

                    <div class="flex gap-2 mt-1">
                        ${socialHtml}
                    </div>
                </div>

                <div class="relative z-10 mt-auto pt-4 border-t border-border/50 flex justify-between items-center">
                     <span class="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">Portfolio</span>
                     <a href="${link}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-xs font-bold text-foreground hover:text-primary transition-colors no-underline group/link">
                        ${linkText} <span class="ml-1 transition-transform group-hover/link:translate-x-1">→</span>
                     </a>
                </div>
            </div>
            `;
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
                rehypePlugins={[rehypeRaw]}
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
