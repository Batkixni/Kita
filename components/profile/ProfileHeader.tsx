'use client';

import { useState } from 'react';
import { EditProfileDialog } from "@/components/settings/EditProfileDialog";
import { Button } from "@/components/ui/button";
import { Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

interface ProfileHeaderProps {
    user: any;
    page: any;
    isOwner: boolean;
    layoutMode?: 'center' | 'side' | 'left' | 'right' | 'minimal';
}

export function ProfileHeader({ user, page, isOwner, layoutMode = 'center' }: ProfileHeaderProps) {
    const [openSettings, setOpenSettings] = useState(false);

    // Theme configs
    const avatarRadius = page?.themeConfig?.avatarRadius || 'full';
    const textColor = page?.themeConfig?.textColor;

    return (
        <header className="flex flex-col items-center text-center space-y-4 pt-20 pb-6 relative w-full">
            {isOwner && (
                <div className="absolute top-4 right-4 z-50 flex gap-2 animate-blur-in opacity-0" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={async () => {
                            await authClient.signOut();
                            window.location.href = "/";
                        }}
                        className="rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80 text-foreground hover:text-destructive transition-colors"
                        title="Sign Out"
                    >
                        <LogOut className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setOpenSettings(true)}
                        className="rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80 text-foreground"
                    >
                        <Settings className="w-5 h-5 text-muted-foreground" />
                    </Button>
                </div>
            )}

            {layoutMode !== 'minimal' && (
                <>
                    <div className="relative group animate-blur-in opacity-0" style={{ animationFillMode: 'forwards' }}>
                        <div className={cn(
                            "w-48 h-48 overflow-hidden border-4 border-background shadow-2xl bg-muted transition-all duration-500",
                            avatarRadius === 'full' ? 'rounded-full' :
                                avatarRadius === 'xl' ? 'rounded-[2.5rem]' :
                                    avatarRadius === 'lg' ? 'rounded-3xl' : 'rounded-none'
                        )}>
                            {user.image ? (
                                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-6xl text-muted-foreground bg-muted">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3 max-w-lg mx-auto px-4 animate-blur-in opacity-0" style={{ animationDelay: '150ms', animationFillMode: 'forwards' }}>
                        <h1
                            className={cn("text-3xl font-bold tracking-tight text-foreground")}
                        >
                            {user.name}
                        </h1>
                        <p className="font-bold bg-background/50 backdrop-blur-md px-3 py-1 rounded-full shadow-sm text-sm inline-block text-muted-foreground">
                            @{user.username}
                        </p>
                        {user.bio && (
                            <p
                                className="text-lg leading-relaxed whitespace-pre-wrap text-muted-foreground"
                            >
                                {user.bio}
                            </p>
                        )}

                        {/* Social Links Rendering */}
                        {page?.heroConfig?.socials && (
                            <div className="flex gap-2 justify-center pt-2 flex-wrap">
                                {page.heroConfig.socials.split(',').map((s: string) => {
                                    const link = s.trim();
                                    if (!link) return null;

                                    let url = link;
                                    let icon = <div className="w-4 h-4 rounded-full bg-current" />; // Fallback

                                    if (link.includes('twitter') || link.includes('x.com')) {
                                        icon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>;
                                    } else if (link.includes('github')) {
                                        icon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 4 1 9 2-2.8 1.5-6.6 2.6-9 4.3-.25 1.74-.25 3.47 0 5.2 2.37 1.7 6.47 1.25 9.03 4.25.9 4.25.9 5.5 2 6 5.5.07 1.25-.26 2.48-1 3.5v4"></path></svg>;
                                    } else if (link.includes('linkedin')) {
                                        icon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>;
                                    } else if (link.includes('instagram')) {
                                        icon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>;
                                    } else {
                                        icon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>;
                                    }

                                    if (!url.startsWith('http')) url = 'https://' + url;

                                    return (
                                        <a
                                            key={link}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-full border border-border/50 bg-background/50 hover:bg-background hover:scale-110 transition-all text-muted-foreground hover:text-foreground shadow-sm"
                                        >
                                            {icon}
                                        </a>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </>
            )}

            {isOwner && (
                <EditProfileDialog
                    user={user}
                    page={page}
                    open={openSettings}
                    onOpenChange={setOpenSettings}
                />
            )}
        </header>
    );
}
