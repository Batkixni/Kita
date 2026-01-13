import { useEffect, useState } from "react";
import { getLinkMetadata, LinkMetadata } from "@/actions/metadata";
import { getYouTubeChannelData, YouTubeChannelData } from "@/actions/youtube";
import { getBehanceData, BehanceData } from "@/actions/behance";
import { getGitHubData, GitHubData } from "@/actions/github";
import { cn } from "@/lib/utils";
import { Youtube, Github, Play, Instagram, Music } from "lucide-react";

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
    const [ytData, setYtData] = useState<YouTubeChannelData | null>(null);
    const [behanceData, setBehanceData] = useState<BehanceData | null>(null);
    const [ghData, setGhData] = useState<GitHubData | null>(null);
    const [loading, setLoading] = useState(false); // OPTIMISTIC LOADING: Start false to show URL immediately

    // Helper to ensure URL has protocol (prevents new URL() crash)
    const ensureProtocol = (str: string) => {
        if (!str) return "";
        if (str.startsWith("http://") || str.startsWith("https://")) return str;
        return `https://${str}`;
    };

    const safeUrl = ensureProtocol(url);

    // Responsive Logic: Show image if module is essentially 2x1 or larger (or 1x2)
    const showImage = w && h && (w >= 2 || h >= 2);

    const isBehance = safeUrl.includes('behance.net/');
    const isYouTube = safeUrl.includes('youtube.com/') || safeUrl.includes('youtu.be/');
    const isGitHub = safeUrl.includes('github.com/');

    useEffect(() => {
        let mounted = true;

        // Reset states on URL change
        if (safeUrl) {
            // Don't set loading=true here to keep the old card visible or show new URL immediately
            // setLoading(true); 
            setMetadata(null);
            setYtData(null);
            setBehanceData(null);
            setGhData(null);

            // 1. Fetch Basic Metadata (Should be fast)
            getLinkMetadata(safeUrl).then(data => {
                if (mounted) {
                    setMetadata(data);
                }
            });

            // 2. Fetch Rich Data Independently (Don't block basic metadata)
            if (isYouTube) {
                getYouTubeChannelData(safeUrl).then(data => {
                    if (mounted && data) setYtData(data);
                });
            }

            if (isBehance) {
                getBehanceData(safeUrl).then(data => {
                    if (mounted && data) setBehanceData(data);
                });
            }

            if (isGitHub) {
                getGitHubData(safeUrl).then(data => {
                    if (mounted && data) setGhData(data);
                });
            }
        }

        return () => { mounted = false; };
    }, [safeUrl, isYouTube, isBehance, isGitHub]);

    const title = customTitle || metadata?.title || safeUrl;
    const desc = customDesc || metadata?.description;
    const image = customImage || metadata?.image;
    const favicon = customFavicon || `https://www.google.com/s2/favicons?domain=${safeUrl}&sz=32`;

    const handleClick = (e: React.MouseEvent) => {
        if (isEditable) {
            e.preventDefault();
        }
    };

    // --- Behance Rich Preview (With Project Grid) ---
    if (behanceData && !customTitle && !customImage) {
        // Responsive Grid: If wide, show more columns to prevent vertical overflow
        const isWide = w && w >= 2;
        const gridClass = isWide ? "grid-cols-5" : "grid-cols-3";
        const visibleItems = isWide ? 5 : 6; // Show 5 items if row is 5, else 6 (2 rows of 3)

        return (
            <a
                href={safeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className={cn(
                    "flex flex-col w-full h-full p-5 bg-[#0057FF]/5 hover:bg-[#0057FF]/10 border border-blue-500/10 transition-colors relative group overflow-hidden text-left",
                    isEditable && "cursor-grab active:cursor-grabbing pointer-events-none"
                )}
            >
                {/* Header Row */}
                <div className="flex items-start justify-between w-full shrink-0">
                    <div className="w-8 h-8 bg-[#0057FF] rounded-lg flex items-center justify-center text-white font-black text-lg shrink-0 shadow-lg shadow-blue-500/20">
                        Bē
                    </div>
                    <div className="bg-[#0057FF] text-white text-[10px] font-bold rounded-full px-2.5 py-1 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform flex items-center gap-1">
                        Follow <span className="opacity-80 font-normal">|</span> {behanceData.followers}
                    </div>
                </div>

                {/* Name */}
                <div className="mt-2.5 mb-3 shrink-0">
                    <span className="font-bold text-base text-foreground leading-none line-clamp-1">{behanceData.displayName}</span>
                    {w && w >= 3 && (
                        <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Behance Portfolio</p>
                    )}
                </div>

                {/* Grid */}
                <div className={cn("grid gap-2 flex-1 w-full min-h-0", gridClass)}>
                    {behanceData.projects.slice(0, visibleItems).map((p) => (
                        <div key={p.id} className="relative w-full h-full rounded-md overflow-hidden bg-black/5 aspect-square">
                            <img src={p.thumbnail} alt={p.title} className="object-cover w-full h-full opacity-90 group-hover:opacity-100 transition-opacity" />
                        </div>
                    ))}
                </div>
            </a>
        );
    }

    // --- Behance Fallback (Scraping Failed, Use Metadata) ---
    if (isBehance && metadata && !customTitle && !customImage) {
        const displayName = metadata.title ? metadata.title.split(' on Behance')[0] : 'Behance User';
        return (
            <a
                href={safeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className={cn(
                    "flex flex-col w-full h-full p-5 bg-[#0057FF]/5 hover:bg-[#0057FF]/10 border border-blue-500/10 transition-colors relative group overflow-hidden text-left justify-between",
                    isEditable && "cursor-grab active:cursor-grabbing pointer-events-none"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#0057FF] rounded-lg flex items-center justify-center text-white font-black text-lg shrink-0 shadow-lg shadow-blue-500/20">Bē</div>
                    </div>
                    <div className="bg-[#0057FF]/10 text-[#0057FF] text-[10px] font-bold rounded-full px-2.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity border border-blue-500/20">
                        View
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-1 mt-auto mb-3">
                    <span className="font-bold text-lg leading-tight text-foreground line-clamp-2">{displayName}</span>
                    <span className="text-[10px] text-muted-foreground font-medium line-clamp-1">{metadata.description || 'Behance Portfolio'}</span>
                </div>

                {/* Big Preview */}
                {metadata.image ? (
                    <div className="w-full h-24 mt-2 rounded-lg overflow-hidden relative bg-black/10 shrink-0">
                        <img src={metadata.image} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity hover:scale-105 duration-500" />
                    </div>
                ) : (
                    <div className="w-full h-10 mt-2 bg-[#0057FF] text-white rounded-lg flex items-center justify-center font-bold text-xs shadow-lg shadow-blue-500/20 shrink-0">
                        View Full Portfolio
                    </div>
                )}
            </a>
        );
    }

    // --- GitHub Contribution Preview ---
    if (ghData && !customTitle && !customImage) {
        // Responsive Scaling
        const isLarge = w && w >= 2;
        const cellClass = isLarge ? "w-4 h-4 rounded-sm" : "w-2.5 h-2.5 rounded-[2px]";
        const gapClass = isLarge ? "gap-1" : "gap-[3px]";
        const containerGap = isLarge ? "gap-1" : "gap-[3px]";

        return (
            <a
                href={safeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className={cn(
                    "flex flex-col w-full h-full p-4 bg-primary/5 hover:bg-primary/10 border border-primary/10 transition-colors relative group overflow-hidden text-left",
                    isEditable && "cursor-grab active:cursor-grabbing pointer-events-none"
                )}
            >
                {/* Header: Icon + Name */}
                <div className="flex items-center gap-2 mb-auto shrink-0 z-10 w-full">
                    <div className={cn(
                        "rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-sm transition-all",
                        isLarge ? "w-10 h-10" : "w-8 h-8"
                    )}>
                        <Github size={isLarge ? 24 : 18} />
                    </div>
                    <div className="flex flex-col leading-tight overflow-hidden flex-1 min-w-0">
                        <span className={cn("font-bold text-foreground truncate", isLarge ? "text-lg" : "text-sm")}>{ghData.username}</span>
                        {ghData.totalContributions ? (
                            <span className="text-[10px] text-muted-foreground font-mono truncate">
                                {ghData.totalContributions.toLocaleString()} contributions
                            </span>
                        ) : (
                            <span className="text-[10px] text-muted-foreground font-mono truncate">GitHub Profile</span>
                        )}
                    </div>
                </div>

                {/* Graph Grid - Added Mask for smooth fade */}
                <div className={cn(
                    "flex flex-col w-full mt-3 h-full justify-end overflow-hidden opacity-80 group-hover:opacity-100 transition-all",
                    containerGap,
                    "[mask-image:linear-gradient(to_right,transparent,black_10%)] md:[mask-image:linear-gradient(to_right,transparent,black_5%)]"
                )}>
                    {ghData.contributionRows.map((row, i) => (
                        <div key={i} className={cn("flex justify-end min-h-0", gapClass)}>
                            {row.map((level, j) => (
                                <div
                                    key={j}
                                    className={cn(
                                        "shrink-0 transition-colors duration-300",
                                        cellClass,
                                        level === 0 ? "bg-primary/5" :
                                            level === 1 ? "bg-primary/30" :
                                                level === 2 ? "bg-primary/50" :
                                                    level === 3 ? "bg-primary/70" :
                                                        "bg-primary"
                                    )}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </a>
        );
    }

    // YouTube Channel Special Preview
    if (ytData && !customTitle && !customImage) {
        return (
            <a
                href={safeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className={cn(
                    "flex flex-col w-full h-full p-5 bg-[#FF0000]/5 hover:bg-[#FF0000]/10 border border-red-500/10 transition-colors relative group overflow-hidden text-left",
                    isEditable && "cursor-grab active:cursor-grabbing pointer-events-none"
                )}
            >
                {/* Channel Header - Use Standard YouTube Favicon */}
                <div className="flex items-center gap-3 mb-4 shrink-0">
                    <div className="w-10 h-10 bg-[#FF0000]/10 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-red-500/20 z-10">
                        <img
                            src="https://www.google.com/s2/favicons?domain=youtube.com&sz=128"
                            alt="YouTube"
                            className="w-6 h-6 object-contain"
                        />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1 z-10">
                        <span className="font-bold text-base text-foreground truncate leading-tight">{ytData.title}</span>
                        <span className="text-xs text-muted-foreground truncate opacity-80">Latest Videos</span>
                    </div>
                </div>

                {/* Video Grid (2x2) */}
                <div className="grid grid-cols-2 gap-2 flex-1 w-full min-h-0">
                    {ytData.videos.slice(0, 4).map((v) => (
                        <div key={v.id} className="relative w-full h-full rounded-md overflow-hidden bg-black/10 aspect-video group/video">
                            <img src={v.thumbnail} className="object-cover w-full h-full opacity-80 group-hover/video:opacity-100 transition-opacity scale-105" />
                            <div className="absolute inset-0 bg-black/20 group-hover/video:bg-transparent transition-colors" />
                        </div>
                    ))}
                </div>
            </a>
        );
    }

    // --- X (Twitter) Special Styling (Even if metadata fails) ---
    const isX = safeUrl.includes('x.com/') || safeUrl.includes('twitter.com/');

    if (isX && !customImage) {
        // ... (existing X code)
        return (
            <a
                href={safeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className={cn(
                    "flex flex-col w-full h-full bg-black/60 hover:bg-black/70 backdrop-blur-md transition-all p-5 relative group overflow-hidden text-left justify-between border border-white/10",
                    isEditable && "cursor-grab active:cursor-grabbing pointer-events-none"
                )}
            >
                <div className="flex items-center gap-2 mb-2">
                    {/* X Logo */}
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-6 h-6 fill-white"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
                    <span className="text-[10px] font-bold text-white/50 tracking-wider">X.COM</span>
                </div>

                <div className="mt-auto">
                    {/* If we have metadata title use it, otherwise show raw path */}
                    <span className="font-bold text-white text-sm leading-tight line-clamp-3">
                        {metadata?.title && metadata.title !== safeUrl
                            ? metadata.title
                            : safeUrl.split('.com/')[1] || 'Post'}
                    </span>
                    {metadata?.description && w && w >= 2 && (
                        <p className="text-[11px] text-white/60 mt-2 line-clamp-2">{metadata.description}</p>
                    )}
                </div>

                {/* Show Image if available (from metadata) */}
                {metadata?.image && showImage && (
                    <div className="absolute inset-0 w-full h-full z-0 opacity-30 group-hover:opacity-40 transition-opacity">
                        <img src={metadata.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0" />
                    </div>
                )}
            </a>
        )
    }

    // --- Instagram Special Styling (Behance-like) ---
    const isInstagram = safeUrl.includes('instagram.com/');

    if (isInstagram && !customImage) {
        // Parse type and handle username
        const pathParts = new URL(safeUrl).pathname.split('/').filter(Boolean);
        const isPost = pathParts.includes('p') || pathParts.includes('reel') || pathParts.includes('reels');
        const username = !isPost ? pathParts[0] : (pathParts[0] === 'p' || pathParts[0] === 'reel' ? 'Instagram User' : pathParts[0]);

        // Helper to decode HTML entities
        const decodeHtml = (html: string) => {
            const txt = document.createElement("textarea");
            txt.innerHTML = html;
            return txt.value;
        };

        const rawTitle = metadata?.title || '';
        const rawDesc = metadata?.description || '';

        // Clean title: "Name (@username) • Instagram..." -> "Name (@username)"
        // Also decode entities
        let cleanTitle = decodeHtml(rawTitle).split(' • Instagram')[0];
        if (!cleanTitle && username) cleanTitle = `@${username}`;
        if (!cleanTitle) cleanTitle = 'Instagram';

        // Clean description
        let cleanDesc = decodeHtml(rawDesc);
        if (cleanDesc.includes('Login')) cleanDesc = '';

        return (
            <a
                href={safeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className={cn(
                    "flex flex-col w-full h-full p-5 bg-pink-500/5 hover:bg-pink-500/10 border border-pink-500/10 transition-colors relative group overflow-hidden text-left justify-between",
                    isEditable && "cursor-grab active:cursor-grabbing pointer-events-none"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 via-red-500 to-orange-400 rounded-lg flex items-center justify-center text-white shrink-0 shadow-lg shadow-pink-500/20">
                            <Instagram size={18} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Instagram</span>
                        </div>
                    </div>
                    <div className="bg-primary/10 text-primary text-[10px] font-bold rounded-full px-2.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity border border-primary/20">
                        {isPost ? 'View Post' : 'Follow'}
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-1 mt-auto mb-3 relative z-10">
                    <span className="font-bold text-lg leading-tight text-foreground line-clamp-2">
                        {cleanTitle}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium line-clamp-2">
                        {cleanDesc || (isPost ? 'View photo and videos' : 'View full profile')}
                    </span>
                </div>

                {/* No Image Preview as requested */}
                <div className="w-full h-8 mt-2 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-lg flex items-center justify-center font-medium text-[10px] text-pink-600/60 border border-pink-500/10 shrink-0">
                    {isPost ? 'Open in App' : 'See Photos & Videos'}
                </div>
            </a>
        )
    }

    // --- Spotify Profile Styling ---
    const isSpotify = safeUrl.includes('open.spotify.com/user') || safeUrl.includes('open.spotify.com/artist');

    if (isSpotify && !customImage) {
        // Parse username/artist name fallback
        const pathParts = new URL(safeUrl).pathname.split('/').filter(Boolean);
        const type = pathParts.includes('artist') ? 'artist' : 'user';
        const rawId = pathParts[pathParts.length - 1];

        // Helper to decode HTML entities (reusing the one from Instagram, strictly for this block scope if needed, or relying on metadata)
        const decodeHtml = (html: string) => {
            const txt = document.createElement("textarea");
            txt.innerHTML = html;
            return txt.value;
        };

        const cleanTitle = metadata?.title ? decodeHtml(metadata.title).split(' | Spotify')[0] : (type === 'artist' ? 'Spotify Artist' : 'Spotify User');
        const cleanDesc = metadata?.description ? decodeHtml(metadata.description) : (type === 'artist' ? 'Artist on Spotify' : 'User on Spotify');

        return (
            <a
                href={safeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className={cn(
                    "flex flex-col w-full h-full p-5 bg-[#1DB954]/5 hover:bg-[#1DB954]/10 border border-[#1DB954]/10 transition-colors relative group overflow-hidden text-left justify-between",
                    isEditable && "cursor-grab active:cursor-grabbing pointer-events-none"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#1DB954] rounded-full flex items-center justify-center text-black shrink-0 shadow-lg shadow-[#1DB954]/20">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 14.82 1.08.54.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.24z" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Spotify</span>
                        </div>
                    </div>
                    <div className="bg-[#1DB954]/10 text-[#1DB954] text-[10px] font-bold rounded-full px-2.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity border border-[#1DB954]/20">
                        Listen
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-1 mt-auto mb-3 relative z-10">
                    <span className="font-bold text-lg leading-tight text-foreground line-clamp-2">
                        {cleanTitle}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium line-clamp-1">
                        {cleanDesc}
                    </span>
                </div>

                {/* Decorative Elements */}
                <div className="w-full h-8 mt-2 bg-[#1DB954]/10 rounded-lg flex items-center justify-center font-medium text-[10px] text-[#1DB954] border border-[#1DB954]/10 shrink-0">
                    Listen on Spotify
                </div>
            </a>
        )
    }

    // Default Link Card
    return (
        <a
            href={safeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className={cn(
                "flex flex-col w-full h-full bg-sidebar-accent/50 hover:bg-sidebar-accent transition-all p-4 relative group overflow-hidden text-left justify-between",
                isEditable && "cursor-grab active:cursor-grabbing pointer-events-none"
            )}
        >
            {/* Top Bar: Favicon + Domain */}
            <div className="flex items-center gap-2 w-full z-10 relative">
                <img src={favicon} alt="" className="w-5 h-5 rounded-sm object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate flex-1 opacity-70">
                    {new URL(safeUrl).hostname.replace('www.', '')}
                </span>
                {/* Hover Icon */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity -mr-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/50">
                        <path d="M7 17L17 7" />
                        <path d="M7 7h10v10" />
                    </svg>
                </div>
            </div>

            {/* Content Middle */}
            <div className="flex flex-col gap-1.5 my-auto z-10 relative pr-2">
                <span className="font-bold text-sm text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {title}
                </span>
                {w && w >= 2 && desc && (
                    <span className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 opacity-80">
                        {desc}
                    </span>
                )}
            </div>

            {/* Background Image (Low Opacity) or Bottom Decor */}
            {image && showImage ? (
                <div className="absolute inset-0 w-full h-full z-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-background/10 z-10" />
                    <img src={image} className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity grayscale group-hover:grayscale-0" />
                </div>
            ) : (
                // Simple Decor if no image
                <div className="w-full h-1 bg-primary/10 rounded-full mt-auto z-10 overflow-hidden relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-primary/20 group-hover:w-full transition-all duration-500" />
                </div>
            )}
        </a>
    );
}
