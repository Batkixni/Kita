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
import { SyntaxGuideDialog } from "./SyntaxGuideDialog";

interface EditModuleDialogProps {
    module: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    themeConfig?: any;
    onSave: (id: string, content: any) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
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

// Helper to parse shortcode attributes
const parseShortcode = (text: string) => {
    const match = text.match(/\{\{(\w+)\s+([^}]+)\}\}/);
    if (!match) return null;

    const type = match[1];
    const argsString = match[2];
    const args: Record<string, string> = {};

    const attrRegex = /(\w+)="([^"]*)"/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(argsString)) !== null) {
        args[attrMatch[1]] = attrMatch[2]; // No need to unescape HTML here as we want raw values for inputs
    }

    return { type, args };
};

export function EditModuleDialog({ module, open, onOpenChange, themeConfig, onSave, onDelete }: EditModuleDialogProps) {
    const [isLoading, setIsLoading] = useState(false);

    // Existing State (used for generic fallback)
    const [text, setText] = useState(module.content?.text || "");
    const [url, setUrl] = useState(module.content?.url || "");
    const [src, setSrc] = useState(module.content?.src || "");
    const [alt, setAlt] = useState(module.content?.alt || "");
    const [customTitle, setCustomTitle] = useState(module.content?.customTitle || "");
    const [customDesc, setCustomDesc] = useState(module.content?.customDesc || "");
    const [customImage, setCustomImage] = useState(module.content?.customImage || "");
    const [customFavicon, setCustomFavicon] = useState(module.content?.customFavicon || "");

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this module?")) return;
        setIsLoading(true);
        try {
            await onDelete(module.id);
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to delete module", error);
            alert("Failed to delete module");
        } finally {
            setIsLoading(false);
        }
    };

    // Determine Logic:
    // If it's a Custom Module with a recognizable shortcode, render the specific form.
    // Otherwise, render the generic editor.

    let EditForm = null;
    let initialData = null;

    if (module.type === 'custom' && module.content?.text) {
        // Special handling for multi-project lists
        const projectMatches = [...module.content.text.matchAll(/\{\{project\s+([^}]+)\}\}/g)];
        if (projectMatches.length > 0) {
            const { ProjectForm } = require('./ModuleForms');
            EditForm = ProjectForm;
            const projects = projectMatches.map(match => {
                const argsString = match[1];
                const args: Record<string, string> = {};
                const attrRegex = /(\w+)="([^"]*)"/g;
                let attrMatch;
                while ((attrMatch = attrRegex.exec(argsString)) !== null) {
                    args[attrMatch[1]] = attrMatch[2];
                }
                return args;
            });
            initialData = { projects };
        } else {
            // Standard single-shortcode parsing
            const parsed = parseShortcode(module.content.text);
            if (parsed) {
                if (parsed.type === 'profile') {
                    const { InfoCardForm } = require('./ModuleForms');
                    EditForm = InfoCardForm;
                    initialData = parsed.args;
                } else if (parsed.type === 'metric') {
                    const { MetricForm } = require('./ModuleForms');
                    EditForm = MetricForm;
                    initialData = parsed.args;
                } else if (parsed.type === 'badge') {
                    const { BadgeForm } = require('./ModuleForms');
                    EditForm = BadgeForm;
                    initialData = parsed.args;
                } else if (parsed.type === 'social') {
                    const { SocialForm } = require('./ModuleForms');
                    EditForm = SocialForm;
                    initialData = parsed.args;
                }
            }
        }
    }

    // Wrapper for Forms to call onSave
    const handleFormSave = async (type: string, content: any) => {
        setIsLoading(true);
        try {
            // Note: Forms return "type" but for custom modules we usually keep it as custom
            // But if the form says 'image', etc. we trust it.
            // Actually, existing forms call onAdd(type, content).
            // We just need to map that to onSave(id, content).
            await onSave(module.id, content);
            onOpenChange(false);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    // Generic Save for fallback inputs
    const handleGenericSave = async () => {
        setIsLoading(true);
        try {
            let newContent = {};
            if (module.type === 'text' || module.type === 'portfolio' || module.type === 'section-title' || module.type === 'custom') {
                newContent = { text };
            } else if (module.type === 'link') {
                newContent = { url, customTitle, customDesc, customImage, customFavicon };
            } else if (module.type === 'image') {
                newContent = { src, alt };
            }
            await onSave(module.id, newContent);
            onOpenChange(false);
        } catch (error) { console.error(error); } finally { setIsLoading(false); }
    }


    // Theme classes
    const themeClass = themeConfig?.cssClass || "";
    // Re-derive isDarkMode
    const isDark = (color?: string) => { /* ... same logic ... */ return false; }; // Simplified for brevity, relying on CSS class
    const isDarkMode = themeClass.includes('dark');
    const previewCssClass = cn(themeClass, isDarkMode ? "dark" : "");

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={cn("sm:max-w-md", previewCssClass)}>
                <DialogHeader>
                    <DialogTitle>Edit Module</DialogTitle>
                    <DialogDescription>
                        Make changes to your module content here.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {EditForm ? (
                        <div className="flex justify-center">
                            <EditForm
                                onAdd={handleFormSave}
                                isLoading={isLoading}
                                initialData={initialData}
                                themeConfig={themeConfig}
                            />
                        </div>
                    ) : (
                        /* Fallback Generic Editor */
                        <div className="grid gap-4">
                            {(module.type === 'text' || module.type === 'portfolio' || module.type === 'section-title' || module.type === 'custom') && (
                                <div className="grid w-full gap-2">
                                    <div className="flex items-center justify-between mb-2">
                                        <Label htmlFor="content">Content</Label>
                                        <div className="flex gap-2 items-center">
                                            {module.type === 'custom' && (
                                                <select
                                                    className="text-xs h-8 rounded-md border border-border bg-background/50 backdrop-blur-sm px-2 py-1 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                                    onChange={(e) => {
                                                        const t = TEMPLATES.find(t => t.label === e.target.value);
                                                        if (t) setText((prev: string) => (prev ? prev + "\n\n" : "") + t.content);
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
                                        placeholder="Enter text..."
                                    />
                                </div>
                            )}

                            {module.type === 'link' && (
                                <div className="grid w-full gap-4">
                                    {/* ... Link inputs ... */}
                                    <div className="grid w-full gap-2">
                                        <Label htmlFor="url">URL</Label>
                                        <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} />
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-stone-200" /></div>
                                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Manual Overrides</span></div>
                                    </div>
                                    <div className="grid w-full gap-2"><Label>Custom Title</Label><Input value={customTitle} onChange={(e) => setCustomTitle(e.target.value)} /></div>
                                    <div className="grid w-full gap-2"><Label>Custom Description</Label><Textarea value={customDesc} onChange={(e) => setCustomDesc(e.target.value)} className="h-20" /></div>
                                    <div className="grid w-full gap-2"><Label>Custom Image</Label><ImageUpload value={customImage} onChange={setCustomImage} /></div>
                                    <div className="grid w-full gap-2"><Label>Custom Favicon</Label><Input value={customFavicon} onChange={(e) => setCustomFavicon(e.target.value)} /></div>
                                </div>
                            )}

                            {module.type === 'image' && (
                                <div className="grid w-full gap-2">
                                    <Label>Image Source</Label>
                                    <ImageUpload value={src} onChange={setSrc} />
                                    <Input value={src} onChange={(e) => setSrc(e.target.value)} placeholder="https://..." />
                                    <Label>Alt Text</Label>
                                    <Input value={alt} onChange={(e) => setAlt(e.target.value)} />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter className="flex justify-between sm:justify-between w-full">
                    <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
                    </Button>
                    {!EditForm && (
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                            <Button onClick={handleGenericSave} disabled={isLoading}>
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                            </Button>
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
