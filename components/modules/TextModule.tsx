'use client';

interface TextModuleProps {
    text: string;
}

export function TextModule({ text }: TextModuleProps) {
    return (
        <div className="w-full h-full p-6 flex items-center justify-center text-center">
            <p className="whitespace-pre-wrap">{text}</p>
        </div>
    );
}
