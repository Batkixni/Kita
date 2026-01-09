'use client';

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface PortfolioModuleProps {
    content: string; // e.g. #Project1[Google]
    w?: number;
    h?: number;
}

export function PortfolioModule({ content, w, h }: PortfolioModuleProps) {
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
                    className={cn(
                        "flex text-left items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition border border-transparent hover:border-border",
                        // If very small (2x2), reduce padding
                        w && w <= 2 && "p-2"
                    )}
                >
                    <div className="min-w-0 flex-1 mr-2">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-0.5 truncate">
                            {project.tag}
                        </span>
                        <span className="font-semibold text-foreground block truncate">
                            {project.name}
                        </span>
                    </div>
                    {/* Hide external link icon if very small to save space, or keep it if crucial */}
                    {project.url && w && w > 2 && <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />}
                    {/* If we had an image preview here (like in screenshot), we should handle it too. 
                        The regex parsed logic currently assumes text-only unless customized. 
                        But the screenshot shows an image. 
                        Wait, the regex is: #Tag[Name](Url). 
                        Where is the image coming from in the screenshot?
                        Ah, the screenshot shows "A..." with an image. 
                        Maybe it's a LinkModule? Or CustomModule?
                        User said "project還是長這樣" (project still looks like this).
                        And title is "ABOUT ME". 
                        If it's PortfolioModule, it parses regex. 
                        Does regex support image? No.
                        Maybe the user is using LinkModule for these?
                        But LinkModule doesn't look like that list.
                        Maybe it's a CustomModule with HTML manually written?
                        Or maybe I am misinterpreting the component.
                        
                        Let's assume it IS PortfolioModule and the user might be using a newer version or I missed something?
                        Review regex: /#(\w+)\[(.*?)\](?:\((.*?)\))?/g
                        It captures Tag, Name, Url.
                        No image path.
                        
                        Wait, if the user is using `CustomModule` to render this list?
                        "About Me" is SectionTitle.
                        The list below...
                        If it IS PortfolioModule, maybe the screenshot is just misleading about the image (maybe it's an emoji or something?).
                        The bottom item has a PICTURE. 
                        PortfolioModule code doesn't render pictures.
                        
                        Is it possible this is NOT PortfolioModule but `LinkModule` inside a grid?
                        But "About Me" is a module. The list is UNDER it.
                        If they are separate modules, then the list items are... what?
                        If they are 1x1 LinkModules? 
                        No, they look like list items inside ONE module.
                        
                        Let's check `CustomModule.tsx`.
                    */}
                    {project.url && (!w || w > 2) && <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />}
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
