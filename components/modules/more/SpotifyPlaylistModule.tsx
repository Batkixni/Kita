import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getLinkMetadata, LinkMetadata } from "@/actions/metadata";

interface SpotifyPlaylistModuleProps {
    url?: string;
    w?: number;
    h?: number;
    theme?: any;
}

export function SpotifyPlaylistModule({ url, w, h, theme }: SpotifyPlaylistModuleProps) {
    const [metadata, setMetadata] = useState<LinkMetadata | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (url) {
            setLoading(true);
            getLinkMetadata(url).then(data => {
                setMetadata(data);
                setLoading(false);
            });
        }
    }, [url]);

    if (!url) return null;

    // Radius handling from theme
    const radiusMap: Record<string, string> = {
        'none': '0px',
        'sm': '0.125rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
    };
    const borderRadius = radiusMap[theme?.radius || '3xl'] || '1.5rem';

    // Parse logic for fallback or deep linking
    const regex = /(?:spotify:|open\.spotify\.com\/(?:embed\/)?)(album|playlist|track|artist)[\/:]([a-zA-Z0-9]+)/;
    const match = url.match(regex);
    const type = match ? match[1] : 'playlist';
    // const id = match ? match[2] : ''; // Unused for link but good for debug

    const displayTitle = metadata?.title?.split(' | Spotify')[0] || 'Spotify Playlist';
    const displayImage = metadata?.image;
    const displayDesc = metadata?.description?.split(' | Spotify')[0];

    // Card Colors (Spotify Green Accent)
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-full relative group overflow-hidden bg-[#121212] hover:bg-[#181818] transition-colors border border-white/5 shadow-xl"
            style={{ borderRadius }}
        >
            {/* Background Gradient Effect */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-[#1DB954]/20 to-transparent opacity-50 pointer-events-none" />

            <div className="flex flex-col h-full p-5 relative z-10">
                {/* Header: Logo + Type */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 text-white/50">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 14.82 1.08.54.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.24z" />
                            </svg>
                        </div>
                        <span className="text-[10px] font-bold tracking-widest text-white/50 uppercase opacity-90">
                            {type}
                        </span>
                    </div>
                </div>

                {/* Main Content: Cover + Info */}
                <div className="flex-1 flex gap-4 min-w-0">
                    {/* Cover Art */}
                    {displayImage && (
                        <div className="relative aspect-square h-full max-h-[120px] shrink-0 rounded-md overflow-hidden shadow-lg bg-white/5">
                            <img src={displayImage} alt="Cover" className="w-full h-full object-cover" />
                        </div>
                    )}

                    {/* Text Info */}
                    <div className="flex flex-col justify-center min-w-0 flex-1 gap-1">
                        <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">
                            {displayTitle}
                        </h3>
                        {displayDesc && (
                            <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed">
                                {displayDesc}
                            </p>
                        )}
                    </div>
                </div>

                {/* Play Button (Bottom Right) */}
                <div className="absolute bottom-4 right-4 bg-[#1DB954] text-black w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-[#1DB954]/20 scale-90 group-hover:scale-105 transition-transform hover:bg-[#1ed760]">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </div>
            </div>
        </a>
    );
}
