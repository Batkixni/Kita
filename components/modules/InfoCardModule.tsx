'use client';

import { Twitter, Github, Globe, Linkedin, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfoCardModuleProps {
    name: string;
    role: string;
    bio: string;
    badges?: string[];
    socials?: { platform: string; url: string }[];
    portfolioUrl?: string;
    className?: string;
}

export function InfoCardModule({ name, role, bio, badges = [], socials = [], portfolioUrl, className }: InfoCardModuleProps) {
    return (
        <div className={cn("flex flex-col h-full justify-between p-5 relative overflow-hidden group bg-background/50 border border-border/50", className)}>
            {/* Background Glows */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/10 blur-3xl rounded-full pointer-events-none transition-all duration-500 group-hover:bg-blue-500/20" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-yellow-500/10 blur-3xl rounded-full pointer-events-none transition-all duration-500 group-hover:bg-yellow-500/20" />

            <div className="relative z-10 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <h1 className="text-4xl font-black text-foreground tracking-tight leading-none">{name}</h1>
                    <div className="flex gap-1 flex-wrap justify-end max-w-[40%]">
                        {badges.map((badge, i) => (
                            <span key={i} className="px-3 py-1 rounded-full border border-border text-xs font-medium text-foreground/80 bg-background/50 backdrop-blur-sm self-start flex items-center">
                                {badge.toLowerCase().includes('pro') && <span className="mr-1 text-yellow-500">♛</span>}
                                {badge}
                            </span>
                        ))}
                    </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed font-medium m-0 line-clamp-3">
                    {bio}
                </p>

                <div className="flex gap-2 mt-1">
                    {socials.map((social, i) => {
                        let Icon = Globe;
                        if (social.platform.includes('twitter') || social.platform.includes('x.com')) Icon = Twitter;
                        if (social.platform.includes('github')) Icon = Github;
                        if (social.platform.includes('linkedin')) Icon = Linkedin;
                        if (social.platform.includes('instagram')) Icon = Instagram;

                        return (
                            <a
                                key={i}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full border border-border bg-background/50 hover:bg-background transition-all text-muted-foreground hover:text-foreground"
                            >
                                <Icon className="w-3.5 h-3.5" />
                            </a>
                        )
                    })}
                </div>
            </div>

            {portfolioUrl && (
                <div className="relative z-10 mt-auto pt-4 border-t border-border/50 flex justify-between items-center">
                    <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">Portfolio</span>
                    <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-bold text-foreground hover:text-primary transition-colors no-underline group/link">
                        {portfolioUrl.replace(/^https?:\/\//, '')} <span className="ml-1 transition-transform group-hover/link:translate-x-1">→</span>
                    </a>
                </div>
            )}
        </div>
    );
}
