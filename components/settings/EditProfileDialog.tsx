'use client';

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ImageUpload } from "../editor/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateProfile, updatePageTheme } from "@/actions/settings";
import { useRouter } from "next/navigation";
import { Loader2, Palette, User, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { THEMES } from "@/lib/themes";

interface EditProfileDialogProps {
    user: any;
    page: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditProfileDialog({ user, page, open, onOpenChange }: EditProfileDialogProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Profile State
    const [name, setName] = useState(user.name);
    const [bio, setBio] = useState(user.bio || "");
    const [image, setImage] = useState(user.image || "");

    // Theme State (Default fallback values)
    const [bgColor, setBgColor] = useState(page.themeConfig?.backgroundColor || "#fafaf9"); // stone-50
    const [textColor, setTextColor] = useState(page.themeConfig?.textColor || "#000000");
    const [radius, setRadius] = useState(page.themeConfig?.radius || "3xl");

    const handleSave = async () => {
        setIsLoading(true);
        try {
            // Save Profile
            await updateProfile(user.id, { name, bio, image });

            // Save Theme
            await updatePageTheme(page.id, {
                backgroundColor: bgColor,
                textColor,
                radius
            });

            router.refresh();
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to save settings", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Profile & Design</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="profile"><User className="w-4 h-4 mr-2" /> Profile</TabsTrigger>
                        <TabsTrigger value="design"><Palette className="w-4 h-4 mr-2" /> Design</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Display Name</Label>
                            <Input value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Bio / Description</Label>
                            <Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about yourself..." />
                        </div>
                        <div className="space-y-2">
                            <Label>Avatar Image</Label>
                            <ImageUpload value={image} onChange={setImage} />
                        </div>
                    </TabsContent>

                    <TabsContent value="design" className="space-y-6 py-4">

                        {/* Pre-built Themes */}
                        <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase text-stone-500 tracking-wider">Pre-Built Themes</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[160px] overflow-y-auto pr-1">
                                {THEMES.map(theme => (
                                    <button
                                        key={theme.id}
                                        onClick={() => {
                                            setBgColor(theme.colors.background);
                                            setRadius(theme.radius);
                                        }}
                                        className={cn(
                                            "flex items-center gap-2 p-2 rounded-lg border text-left transition-all hover:scale-[1.02]",
                                            "hover:bg-stone-50 hover:border-stone-300",
                                            // Highlight if matches current settings (approximation)
                                            bgColor === theme.colors.background && radius === theme.radius
                                                ? "ring-2 ring-black border-transparent"
                                                : "border-stone-200"
                                        )}
                                    >
                                        <div
                                            className={cn("w-4 h-4 rounded-full border border-stone-100 shadow-sm")}
                                            style={{ backgroundColor: theme.colors.background }}
                                        />
                                        <span className="text-xs font-medium text-stone-700 truncate">{theme.name}</span>
                                        {bgColor === theme.colors.background && radius === theme.radius && (
                                            <Check className="ml-auto w-3 h-3 text-black" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-px bg-stone-100 w-full" />

                        {/* Customization */}
                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase text-stone-500 tracking-wider">Customization</Label>

                            <div className="space-y-2">
                                <Label>Background Color</Label>
                                <div className="flex gap-2">
                                    <div className="relative w-10 h-10 overflow-hidden rounded-lg border border-stone-200 shadow-sm">
                                        <Input
                                            type="color"
                                            value={bgColor}
                                            onChange={e => setBgColor(e.target.value)}
                                            className="absolute -top-2 -left-2 w-16 h-16 p-0 border-0 cursor-pointer"
                                        />
                                    </div>
                                    <Input
                                        value={bgColor}
                                        onChange={e => setBgColor(e.target.value)}
                                        className="flex-1 font-mono text-xs uppercase"
                                        placeholder="#FFFFFF"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Corner Radius</Label>
                                <div className="flex gap-2 p-1 bg-stone-50 rounded-xl border border-stone-200">
                                    {['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'].map(r => (
                                        <button
                                            key={r}
                                            onClick={() => setRadius(r)}
                                            className={cn(
                                                "flex-1 h-8 text-[10px] font-medium transition-all rounded-lg",
                                                radius === r
                                                    ? "bg-white text-black shadow-sm ring-1 ring-black/5"
                                                    : "text-stone-400 hover:text-stone-600 hover:bg-stone-100"
                                            )}
                                            title={`Radius: ${r}`}
                                        >
                                            {r === 'none' ? '0' : r.replace('xl', '')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <DialogFooter>
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
