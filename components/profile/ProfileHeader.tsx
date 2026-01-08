'use client';

import { useState } from 'react';
import { EditProfileDialog } from "@/components/settings/EditProfileDialog";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileHeaderProps {
    user: any;
    page: any;
    isOwner: boolean;
}

export function ProfileHeader({ user, page, isOwner }: ProfileHeaderProps) {
    const [openSettings, setOpenSettings] = useState(false);

    // Theme configs
    const avatarRadius = page?.themeConfig?.avatarRadius || 'full';
    const textColor = page?.themeConfig?.textColor;

    return (
        <header className="flex flex-col items-center text-center space-y-4 py-12 relative w-full">
            {isOwner && (
                <div className="absolute top-4 right-4 z-50 animate-blur-in opacity-0" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setOpenSettings(true)}
                        className="rounded-full bg-white/50 backdrop-blur-sm hover:bg-white/80 dark:bg-black/20 dark:hover:bg-black/40 dark:text-white"
                    >
                        <Settings className="w-5 h-5 text-stone-700 dark:text-stone-200" />
                    </Button>
                </div>
            )}

            <div className="relative group animate-blur-in opacity-0" style={{ animationFillMode: 'forwards' }}>
                <div className={cn(
                    "w-32 h-32 overflow-hidden border-4 border-white dark:border-stone-800 shadow-lg bg-stone-200",
                    `rounded-${avatarRadius === 'none' ? 'none' : avatarRadius}`
                )}>
                    {user.image ? (
                        <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl text-stone-400 bg-stone-100 dark:bg-stone-800 dark:text-stone-600">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-3 max-w-lg mx-auto px-4 animate-blur-in opacity-0" style={{ animationDelay: '150ms', animationFillMode: 'forwards' }}>
                <h1
                    className={cn("text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50")}
                    style={textColor ? { color: textColor } : undefined}
                >
                    {user.name}
                </h1>
                <p className="font-bold bg-white/50 dark:bg-black/30 backdrop-blur-md px-3 py-1 rounded-full shadow-sm text-sm inline-block text-stone-600 dark:text-stone-300">
                    @{user.username}
                </p>
                {user.bio && (
                    <p
                        className="text-lg leading-relaxed whitespace-pre-wrap text-stone-600 dark:text-stone-300"
                        style={textColor ? { color: textColor } : undefined}
                    >
                        {user.bio}
                    </p>
                )}
            </div>

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
