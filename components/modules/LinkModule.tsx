import { useEffect, useState } from "react";
import { getLinkMetadata, LinkMetadata } from "@/actions/metadata";
import { cn } from "@/lib/utils";

interface LinkModuleProps {
    url: string;
}

export function LinkModule({ url, w, h, customTitle, customDesc, customImage, customFavicon, isEditable, theme }: {
    url: string,
    w?: number,
    h?: number,
    customTitle?: string,
    customDesc?: string,
    customImage?: string,
    customFavicon?: string,
    isEditable?: boolean,
    theme?: any
}) {
    const [metadata, setMetadata] = useState<LinkMetadata | null>(null);
    const [loading, setLoading] = useState(true);

    // Responsive Logic: Show image if module is essentially 2x1 or larger (or 1x2)
    const showImage = w && h && (w >= 2 || h >= 2);

    useEffect(() => {
        let mounted = true;
        if (url) {
            setLoading(true);
            getLinkMetadata(url).then(data => {
                if (mounted) {
                    setMetadata(data);
                    setLoading(false);
                }
            });
        }
        return () => { mounted = false; };
    }, [url]);

    const title = customTitle || metadata?.title || url;
    const desc = customDesc || metadata?.description;
    const image = customImage || metadata?.image;
    const favicon = customFavicon || `https://www.google.com/s2/favicons?domain=${url}&sz=32`;

    const handleClick = (e: React.MouseEvent) => {
        if (isEditable) {
            e.preventDefault();
        }
    };

    // Fallback while loading (only if no custom data provided)
    if (loading && !customTitle && !customImage) {
        return (
            <div className="flex flex-col h-full w-full bg-accent/50 animate-pulse rounded-3xl overflow-hidden">
                <div className="h-2/3 bg-muted" />
                <div className="flex-1 bg-card p-3 space-y-2">
                    <div className="h-3 bg-muted rounded w-3/4" />
                    <div className="h-2 bg-muted/50 rounded w-1/2" />
                </div>
            </div>
        );
    }

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className={cn(
                "flex flex-col h-full w-full group bg-card overflow-hidden text-left decoration-0 relative p-4 transition-colors hover:bg-accent/50",
                isEditable && "cursor-grab active:cursor-grabbing pointer-events-none"
            )}
        >
            {/* Header: Favicon + Domain */}
            <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
                    <img src={favicon} alt="" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                </div>
                <span className="text-xs text-muted-foreground font-medium truncate">
                    {new URL(url).hostname.replace('www.', '')}
                </span>
            </div>

            {/* Title */}
            <h3 className="font-bold text-card-foreground text-sm leading-snug line-clamp-3 mb-3 group-hover:text-primary transition-colors">
                {title}
            </h3>

            {/* Image (Bottom) */}
            {showImage && (
                <>
                    {image ? (
                        <div className="flex-1 w-full relative overflow-hidden rounded-xl bg-muted border border-border/50">
                            <img
                                src={image}
                                alt={title}
                                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                    ) : (
                        <div className="flex-1 w-full bg-muted/50 rounded-xl flex items-center justify-center border border-dashed border-border/50">
                            <span className="text-muted-foreground text-xs">No Preview</span>
                        </div>
                    )}
                </>
            )}
        </a>
    );
}
