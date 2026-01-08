'use client';

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "./ImageUpload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateModuleContent, deleteModule } from "@/actions/modules";
import { SyntaxGuideDialog } from "./SyntaxGuideDialog";

interface EditModuleDialogProps {
    module: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const TEMPLATES = [
    {
        label: "Project List",
        content: `{{project title="New Project" desc="Description goes here" link="#"}}
{{project title="Another Project" desc="With custom image" link="#" image="https://github.com/shadcn.png"}}`
    },
    {
        label: "Metrics / Counters",
        content: `{{metric label="Revenue" value="$9,383"}}
<div class="h-4"></div>
{{metric label="Active Users" value="2.6k" unit="+12%"}}`
    },
    {
        label: "Badges / Pills",
        content: `{{badge text="Compact" color="yellow"}}
{{badge text="Customizable" color="stone"}}
{{badge text="API-Ready" color="blue"}}`
    },
    {
        label: "Tips / Stat Card",
        content: `{{tip count="13" label="tips received"}}`
    }
];

export function EditModuleDialog({ module, open, onOpenChange }: EditModuleDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    // Initialize state based on module type
    const [text, setText] = useState(module.content?.text || "");
    const [url, setUrl] = useState(module.content?.url || "");
    const [src, setSrc] = useState(module.content?.src || "");
    const [alt, setAlt] = useState(module.content?.alt || "");

    const handleSave = async () => {
        setIsLoading(true);
        try {
            let newContent = {};
            if (module.type === 'text' || module.type === 'portfolio' || module.type === 'section-title' || module.type === 'custom') {
                newContent = { text };
            } else if (module.type === 'link') {
                newContent = { url };
            } else if (module.type === 'image') {
                newContent = { src, alt };
            }

            await updateModuleContent(module.id, newContent);
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to update module", error);
            alert("Failed to save changes");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this module?")) return;
        setIsLoading(true);
        try {
            await deleteModule(module.id);
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to delete module", error);
            alert("Failed to delete module");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Module</DialogTitle>
                    <DialogDescription>
                        Make changes to your module content here.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {(module.type === 'text' || module.type === 'portfolio' || module.type === 'section-title' || module.type === 'custom') && (
                        <div className="grid w-full gap-2">
                            <div className="flex items-center justify-between mb-2">
                                <Label htmlFor="content">Content</Label>
                                <div className="flex gap-2 items-center">
                                    {module.type === 'custom' && (
                                        <select
                                            className="text-xs h-8 rounded-md border border-stone-200 bg-white px-2 py-1 text-stone-600 focus:outline-none focus:ring-2 focus:ring-stone-400"
                                            onChange={(e) => {
                                                const t = TEMPLATES.find(t => t.label === e.target.value);
                                                if (t) setText(prev => (prev ? prev + "\n\n" : "") + t.content);
                                                e.target.value = "";
                                            }}
                                        >
                                            <option value="">+ Add Template</option>
                                            {TEMPLATES.map(t => <option key={t.label} value={t.label}>{t.label}</option>)}
                                        </select>
                                    )}
                                    {module.type === 'custom' && <SyntaxGuideDialog />}
                                </div>
                            </div>
                            <Textarea
                                id="content"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className={cn("min-h-[100px]", module.type === 'custom' && "font-mono text-xs min-h-[300px]")}
                                placeholder={
                                    module.type === 'portfolio' ? "#Tag[Name](Url)" :
                                        module.type === 'custom' ? "Enter Markdown/HTML..." :
                                            "Enter text..."
                                }
                            />
                            {module.type === 'portfolio' && (
                                <p className="text-xs text-stone-500">
                                    Use syntax: #Tag[Project Name](URL)
                                </p>
                            )}
                        </div>
                    )}

                    {module.type === 'link' && (
                        <div className="grid w-full gap-4">
                            <div className="grid w-full gap-2">
                                <Label htmlFor="url">URL</Label>
                                <Input
                                    id="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://example.com"
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-stone-200" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-stone-500">Manual Overrides</span>
                                </div>
                            </div>

                            <div className="grid w-full gap-2">
                                <Label>Custom Title (Optional)</Label>
                                <Input
                                    value={module.content?.customTitle || ""}
                                    onChange={(e) => updateModuleContent(module.id, { ...module.content, url, customTitle: e.target.value })}
                                    placeholder="Override title..."
                                />
                            </div>
                            <div className="grid w-full gap-2">
                                <Label>Custom Description (Optional)</Label>
                                <Textarea
                                    value={module.content?.customDesc || ""}
                                    onChange={(e) => updateModuleContent(module.id, { ...module.content, url, customDesc: e.target.value })}
                                    placeholder="Override description..."
                                    className="h-20"
                                />
                            </div>
                            <div className="grid w-full gap-2">
                                <Label>Custom Cover Image (Optional)</Label>
                                <ImageUpload
                                    value={module.content?.customImage || ""}
                                    onChange={(val) => updateModuleContent(module.id, { ...module.content, url, customImage: val })}
                                />
                            </div>
                            <div className="grid w-full gap-2">
                                <Label>Custom Favicon URL (Optional)</Label>
                                <Input
                                    value={module.content?.customFavicon || ""}
                                    onChange={(e) => updateModuleContent(module.id, { ...module.content, url, customFavicon: e.target.value })}
                                    placeholder="https://example.com/favicon.ico"
                                />
                            </div>
                        </div>
                    )}

                    {module.type === 'image' && (
                        <>
                            <div className="grid w-full gap-2">
                                <Label>Image Source</Label>
                                <div className="flex flex-col gap-2">
                                    <ImageUpload value={src} onChange={setSrc} />
                                    <div className="text-xs text-center text-stone-400">- OR -</div>
                                    <Input
                                        value={src}
                                        onChange={(e) => setSrc(e.target.value)}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>
                            </div>
                            <div className="grid w-full gap-2">
                                <Label htmlFor="alt">Alt Text</Label>
                                <Input
                                    id="alt"
                                    value={alt}
                                    onChange={(e) => setAlt(e.target.value)}
                                    placeholder="Image description"
                                />
                            </div>
                        </>
                    )}
                </div>

                <DialogFooter className="flex justify-between sm:justify-between w-full">
                    <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={isLoading}>
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
