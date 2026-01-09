'use client';

import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface CustomModuleProps {
    content: string;
    className?: string;
    isEditable?: boolean;
}

const processShortcodes = (text: string) => {
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

            // Right side content: Image or Arrow
            const boxSize = "w-24 h-16";
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

        return match;
    });
};

export function CustomModule({ content, className, isEditable }: CustomModuleProps) {
    if (!content) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-stone-300 p-4">
                <span className="text-xs font-mono">Empty Custom Module</span>
            </div>
        );
    }

    // Process shortcodes before rendering markdown
    // This allows the shortcodes to expand into HTML, which rehype-raw then handles
    const processedContent = processShortcodes(content);

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
