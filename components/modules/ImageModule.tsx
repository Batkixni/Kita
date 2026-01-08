'use client';

interface ImageModuleProps {
    src: string;
    alt?: string;
}

export function ImageModule({ src, alt }: ImageModuleProps) {
    return (
        <div className="w-full h-full relative overflow-hidden">
            <img
                src={src}
                alt={alt || "Module image"}
                className="w-full h-full object-cover"
            />
        </div>
    );
}
