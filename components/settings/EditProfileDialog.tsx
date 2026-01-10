'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ImageUpload } from "../editor/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateProfile, updatePageTheme, updatePageHero } from "@/actions/settings";
import { Loader2, Palette, User, Link as LinkIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getAvailableThemes, ThemeFile } from "@/actions/themes";

interface EditProfileDialogProps {
    user: any;
    page: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}
export function EditProfileDialog({ user, page, open, onOpenChange }: EditProfileDialogProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [availableSchemes, setAvailableSchemes] = useState<ThemeFile[]>([{ id: 'default', name: 'Default (Monochrome)' }]);

    // Profile State
    const [name, setName] = useState(user.name);
    const [bio, setBio] = useState(user.bio || "");
    const [image, setImage] = useState(user.image || "");
    const [socials, setSocials] = useState(page.heroConfig?.socials || "");

    // Theme State Parsing
    const currentCssClass = (page.themeConfig?.cssClass || "") as string;

    // Extract initial scheme from class (e.g. "theme-caffeine" -> "caffeine")
    const getInitialScheme = (cssClass: string) => {
        const match = cssClass.match(/theme-([a-z0-9-]+)/);
        return match ? match[1] : 'default';
    };

    const initialScheme = getInitialScheme(currentCssClass);
    const initialMode = currentCssClass.includes('dark') || (!page.themeConfig?.backgroundColor && page.themeConfig?.cssClass?.includes('dark')) ? 'dark' : 'light';

    const [mode, setMode] = useState<'light' | 'dark'>(initialMode);
    const [colorScheme, setColorScheme] = useState<string>(initialScheme);

    // Theme State
    const [bgColor, setBgColor] = useState<string | null>(page.themeConfig?.backgroundColor ?? null);
    const [textColor, setTextColor] = useState(page.themeConfig?.textColor || null);
    const [radius, setRadius] = useState(page.themeConfig?.radius || "0.625rem");
    const [avatarRadius, setAvatarRadius] = useState(page.themeConfig?.avatarRadius || "full");
    const [layoutMode, setLayoutMode] = useState(page.themeConfig?.layoutMode || "center");
    // Mobile State
    const [mobileAlign, setMobileAlign] = useState(page.themeConfig?.mobileAlign || "center"); // center, left
    const [mobileOrder, setMobileOrder] = useState(page.themeConfig?.mobileOrder || "top"); // top, bottom

    // Fetch themes on mount
    useEffect(() => {
        const fetchThemes = async () => {
            const themes = await getAvailableThemes();
            setAvailableSchemes([
                { id: 'default', name: 'Default (Monochrome)' },
                ...themes.map(t => ({ id: t.id, name: t.name }))
            ]);
        };
        if (open) {
            fetchThemes();
        }
    }, [open]);

    const handleSchemeChange = (schemeId: string) => {
        setColorScheme(schemeId);
        updatePresetValues(schemeId, mode);
    };

    const handleModeChange = (newMode: 'light' | 'dark') => {
        setMode(newMode);
        updatePresetValues(colorScheme, newMode);
    };

    const updatePresetValues = (schemeId: string, mode: 'light' | 'dark') => {
        // This logic is a heuristic. Ideally, we read the CSS or just let CSS variables handle it.
        // For now, we set explicit background only for consistency with previous behavior, 
        // OR we can explicitly set it to NULL if we trust the class to handle it.
        // The user seems to prefer strict colors.

        // However, if we are using CSS classes, we might NOT need to set inline styles at all!
        // Let's try setting default backgrounds based on "dark/light" assumption if not monochrome.

        if (schemeId === 'default') {
            if (mode === 'light') setBgColor('oklch(1.00 0 0)');
            else setBgColor(null);
        } else {
            // For custom themes (caffeine, etc), we assume the CSS class handles the background
            // unless the user overrides it.
            // But to avoid "transparent" flash, maybe we should set null and let class take over?
            // The previous logic for caffeine set specific colors.
            // Let's settle on: Default bg is null (class driven) unless Default Monochrome Light (white).
            // Actually, for consistency, let's try to set to null for custom themes so CSS values apply.
            if (mode === 'light') {
                // Try to guess or just set to null?
                // If we set to null, the component renders <div className="... theme-caffeine">
                // and the CSS variable --background applies. 
                // The Page component uses style={bgColor ...}. If bgColor is null, it uses class.
                setBgColor(null);
            } else {
                setBgColor(null);
            }
        }
        setRadius('0.625rem');
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            // Construct CSS Class
            let cssClass = "";
            if (colorScheme !== 'default') {
                cssClass += `theme-${colorScheme}`;
            }
            if (mode === 'dark') {
                cssClass += (cssClass ? " " : "") + "dark";
            }

            // Save Profile
            await updateProfile(user.id, { name, bio, image });

            // Save Hero Config (Socials)
            await updatePageHero(page.id, { ...(page.heroConfig || {}), socials });

            // Save Theme
            await updatePageTheme(page.id, {
                backgroundColor: bgColor,
                textColor,
                radius,
                avatarRadius,
                layoutMode,
                mobileAlign,
                mobileOrder,
                cssClass
            });

            router.refresh();
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to save settings", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Compute preview class to apply strictly to this dialog's content
    const previewCssClass = cn(
        colorScheme !== 'default' ? `theme-${colorScheme}` : "",
        mode === 'dark' ? "dark" : ""
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={cn("sm:max-w-[425px]", previewCssClass)}>
                <DialogHeader>
                    <DialogTitle>Edit Profile & Design</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-xl">
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
                            <div className="flex items-center justify-between">
                                <Label>Social Links</Label>
                                <span className="text-[10px] text-muted-foreground">comma separated URLs</span>
                            </div>
                            <Input
                                value={socials}
                                onChange={e => setSocials(e.target.value)}
                                placeholder="twitter.com/user, github.com/user"
                                className="font-mono text-xs"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Avatar Image</Label>
                            <ImageUpload value={image} onChange={setImage} />
                        </div>
                        <div className="space-y-2">
                            <Label>Avatar Shape</Label>
                            <div className="flex gap-2 p-1 bg-muted rounded-xl border border-border w-fit">
                                {[
                                    { id: 'full', label: 'Circle', class: 'rounded-full' },
                                    { id: 'xl', label: 'Squircle', class: 'rounded-xl' },
                                    { id: 'lg', label: 'Rounded', class: 'rounded-lg' },
                                    { id: 'none', label: 'Square', class: 'rounded-none' }
                                ].map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => setAvatarRadius(s.id)}
                                        className={cn(
                                            "px-3 py-1.5 text-[10px] font-medium transition-all rounded-lg flex items-center gap-2",
                                            avatarRadius === s.id
                                                ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                                                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                                        )}
                                    >
                                        <div className={cn("w-3 h-3 bg-current opacity-50", s.class)} />
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="design" className="space-y-6 py-4">

                        {/* Theme Settings */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Theme Mode</Label>
                                <Select value={mode} onValueChange={(v: 'light' | 'dark') => handleModeChange(v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select mode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="light">Light Mode</SelectItem>
                                        <SelectItem value="dark">Dark Mode</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Color Scheme</Label>
                                <Select value={colorScheme} onValueChange={handleSchemeChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select scheme" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableSchemes.map(scheme => (
                                            <SelectItem key={scheme.id} value={scheme.id}>
                                                {scheme.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="h-px bg-border w-full" />

                        {/* Layout */}
                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Page Layout</Label>
                            <div className="grid grid-cols-4 gap-2">
                                <button
                                    onClick={() => setLayoutMode('center')}
                                    className={cn(
                                        "flex flex-col items-center gap-2 p-3 rounded-lg border transition-all",
                                        layoutMode === 'center'
                                            ? "border-foreground bg-muted text-foreground"
                                            : "border-border text-muted-foreground hover:bg-muted/50"
                                    )}
                                >
                                    <div className="flex flex-col gap-1 w-8 h-8 opacity-50">
                                        <div className="w-full h-3 bg-current rounded-[1px]" />
                                        <div className="w-full h-full bg-current rounded-[1px]" />
                                    </div>
                                    <span className="text-[10px] font-medium">Center</span>
                                </button>
                                <button
                                    onClick={() => setLayoutMode('left')}
                                    className={cn(
                                        "flex flex-col items-center gap-2 p-3 rounded-lg border transition-all",
                                        layoutMode === 'left'
                                            ? "border-foreground bg-muted text-foreground"
                                            : "border-border text-muted-foreground hover:bg-muted/50"
                                    )}
                                >
                                    <div className="flex gap-1 w-8 h-8 opacity-50">
                                        <div className="w-1/3 h-full bg-current rounded-[1px]" />
                                        <div className="w-2/3 h-full bg-current rounded-[1px]" />
                                    </div>
                                    <span className="text-[10px] font-medium">Right Stack</span>
                                </button>
                                <button
                                    onClick={() => setLayoutMode('right')}
                                    className={cn(
                                        "flex flex-col items-center gap-2 p-3 rounded-lg border transition-all",
                                        layoutMode === 'right'
                                            ? "border-foreground bg-muted text-foreground"
                                            : "border-border text-muted-foreground hover:bg-muted/50"
                                    )}
                                >
                                    <div className="flex gap-1 w-8 h-8 opacity-50">
                                        <div className="w-2/3 h-full bg-current rounded-[1px]" />
                                        <div className="w-1/3 h-full bg-current rounded-[1px]" />
                                    </div>
                                    <span className="text-[10px] font-medium">Left Stack</span>
                                </button>
                                <button
                                    onClick={() => setLayoutMode('minimal')}
                                    className={cn(
                                        "flex flex-col items-center gap-2 p-3 rounded-lg border transition-all",
                                        layoutMode === 'minimal'
                                            ? "border-foreground bg-muted text-foreground"
                                            : "border-border text-muted-foreground hover:bg-muted/50"
                                    )}
                                >
                                    <div className="flex flex-col gap-1 w-8 h-8 opacity-50 justify-center">
                                        <div className="w-full h-1 bg-current rounded-[1px]" />
                                        <div className="w-full h-1 bg-current rounded-[1px]" />
                                        <div className="w-full h-1 bg-current rounded-[1px]" />
                                    </div>
                                    <span className="text-[10px] font-medium">Modules Only</span>
                                </button>
                            </div>
                        </div>



                        <div className="h-px bg-border w-full" />

                        {/* Customization */}
                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Customization</Label>

                            <div className="space-y-2">
                                <Label>Background Color</Label>
                                <div className="flex gap-2">
                                    <div className="relative w-10 h-10 overflow-hidden rounded-lg border border-border shadow-sm">
                                        <Input
                                            type="color"
                                            value={bgColor || ""}
                                            onChange={e => setBgColor(e.target.value)}
                                            className="heading-font absolute -top-2 -left-2 w-16 h-16 p-0 border-0 cursor-pointer"
                                        />
                                    </div>
                                    <Input
                                        value={bgColor || ""}
                                        onChange={e => setBgColor(e.target.value)}
                                        className="flex-1 font-mono text-xs uppercase"
                                        placeholder="Inherit (CSS Variable)"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Corner Radius</Label>
                                <div className="flex gap-2 p-1 bg-muted rounded-xl border border-border">
                                    {['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'].map(r => (
                                        <button
                                            key={r}
                                            onClick={() => setRadius(r)}
                                            className={cn(
                                                "flex-1 h-8 text-[10px] font-medium transition-all rounded-lg",
                                                radius === r
                                                    ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                                            )}
                                            title={`Radius: ${r}`}
                                        >
                                            {r === 'none' ? '0' : r === 'xl' ? 'xl' : r.replace('xl', '')}
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
        </Dialog >
    );
}
