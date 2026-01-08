'use client';

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface PortfolioModuleProps {
    content: string; // e.g. #Project1[Google]
}

export function PortfolioModule({ content }: PortfolioModuleProps) {
    const projects = useMemo(() => {
        // Regex to parse #Tag[Name](Url) or just #Tag[Name]
        // Example: #fullstack[My App](https://myapp.com)
        const regex = /#(\w+)\[(.*?)\](?:\((.*?)\))?/g;
        const matches = [];
        let match;
        while ((match = regex.exec(content)) !== null) {
            matches.push({
                tag: match[1],
                name: match[2],
                url: match[3]
            });
        }
        return matches;
    }, [content]);

    return (
        <div className="w-full h-full p-4 flex flex-col gap-2 overflow-y-auto">
            {projects.map((project, i) => (
                <a
                    key={i}
                    href={project.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex text-left items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-stone-100 transition border border-transparent hover:border-stone-200"
                >
                    <div>
                        <span className="text-xs font-medium text-stone-500 uppercase tracking-wider block mb-1">
                            {project.tag}
                        </span>
                        <span className="font-semibold text-stone-900 block">
                            {project.name}
                        </span>
                    </div>
                    {project.url && <ExternalLink className="w-4 h-4 text-stone-400" />}
                </a>
            ))}
            {projects.length === 0 && (
                <div className="text-stone-400 text-sm text-center mt-4">
                    Use format #tag[Name](url) to add projects
                </div>
            )}
        </div>
    );
}
