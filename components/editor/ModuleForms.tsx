'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "./ImageUpload";
import { ArrowUp, Loader2 } from "lucide-react";
import { SyntaxGuideDialog } from "./SyntaxGuideDialog";

interface FormProps {
    onAdd: (type: string, content: any, w?: number, h?: number) => void;
    isLoading?: boolean;
    themeConfig?: any;
}

export function ProjectForm({ onAdd, isLoading }: FormProps) {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [link, setLink] = useState("");
    const [image, setImage] = useState("");

    const handleSubmit = () => {
        if (!title) return;
        const shortcode = `{{project title="${title}" desc="${desc}" link="${link || '#'}" image="${image}"}}`;
        onAdd('custom', { text: shortcode }, 4, 1);
    };

    return (
        <div className="w-[320px] p-1 flex flex-col gap-3">
            <div className="space-y-1">
                <Label className="text-xs">Project Title</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="My Cool Project" className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
                <Label className="text-xs">Description</Label>
                <Textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Short description..." className="h-16 text-xs resize-none" />
            </div>
            <div className="space-y-1">
                <Label className="text-xs">Link (Optional)</Label>
                <Input value={link} onChange={e => setLink(e.target.value)} placeholder="https://..." className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
                <Label className="text-xs">Thumbnail (Optional)</Label>
                <div className="h-24">
                    <ImageUpload value={image} onChange={setImage} className="h-full" />
                </div>
            </div>
            <div className="flex justify-end pt-2">
                <Button size="sm" onClick={handleSubmit} disabled={isLoading || !title}>
                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Add Project"}
                </Button>
            </div>
        </div>
    );
}

export function MetricForm({ onAdd, isLoading }: FormProps) {
    const [label, setLabel] = useState("");
    const [value, setValue] = useState("");
    const [unit, setUnit] = useState("");

    const handleSubmit = () => {
        if (!label || !value) return;
        const shortcode = `{{metric label="${label}" value="${value}" unit="${unit}"}}`;
        onAdd('custom', { text: shortcode }, 2, 2);
    };

    return (
        <div className="w-[240px] p-1 flex flex-col gap-3">
            <div className="space-y-1">
                <Label className="text-xs">Label</Label>
                <Input value={label} onChange={e => setLabel(e.target.value)} placeholder="Revenue" className="h-8 text-xs" />
            </div>
            <div className="flex gap-2">
                <div className="space-y-1 flex-1">
                    <Label className="text-xs">Value</Label>
                    <Input value={value} onChange={e => setValue(e.target.value)} placeholder="$10k" className="h-8 text-xs" />
                </div>
                <div className="space-y-1 w-16">
                    <Label className="text-xs">Unit</Label>
                    <Input value={unit} onChange={e => setUnit(e.target.value)} placeholder="+10%" className="h-8 text-xs" />
                </div>
            </div>
            <div className="flex justify-end pt-2">
                <Button size="sm" onClick={handleSubmit} disabled={isLoading || !label || !value}>
                    Add Metric
                </Button>
            </div>
        </div>
    );
}

export function BadgeForm({ onAdd, isLoading }: FormProps) {
    const [text, setText] = useState("");
    const [color, setColor] = useState("stone");

    const handleSubmit = () => {
        if (!text) return;
        const shortcode = `{{badge text="${text}" color="${color}"}}`;
        onAdd('custom', { text: shortcode }, 2, 1);
    };

    return (
        <div className="w-[240px] p-1 flex flex-col gap-3">
            <div className="space-y-1">
                <Label className="text-xs">Badge Text</Label>
                <Input value={text} onChange={e => setText(e.target.value)} placeholder="Open Source" className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
                <Label className="text-xs">Color</Label>
                <Select value={color} onValueChange={setColor}>
                    <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="stone">Default (Stone)</SelectItem>
                        <SelectItem value="blue">Blue</SelectItem>
                        <SelectItem value="green">Green</SelectItem>
                        <SelectItem value="yellow">Yellow</SelectItem>
                        <SelectItem value="red">Red</SelectItem>
                        <SelectItem value="black">Black</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex justify-end pt-2">
                <Button size="sm" onClick={handleSubmit} disabled={isLoading || !text}>
                    Add Badge
                </Button>
            </div>
        </div>
    );
}



export function ImageForm({ onAdd, isLoading }: FormProps) {
    const [url, setUrl] = useState("");

    const handleSubmit = () => {
        if (!url) return;
        onAdd('image', { src: url, alt: 'Image' }, 2, 2);
    };

    return (
        <div className="w-[300px] p-1 flex flex-col gap-3">
            <Label className="text-xs">Upload Image</Label>
            <div className="h-32">
                <ImageUpload value={url} onChange={setUrl} className="h-full" />
            </div>
            <div className="flex justify-end pt-2">
                <Button size="sm" onClick={handleSubmit} disabled={isLoading || !url}>
                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Add Image"}
                </Button>
            </div>
        </div>
    );
}

export function LinkForm({ onAdd, isLoading }: FormProps) {
    const [url, setUrl] = useState("");

    const handleSubmit = () => {
        if (!url) return;
        onAdd('link', { url }, 2, 2);
    };

    return (
        <div className="w-[300px] flex items-center gap-2">
            <Input
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="Paste link here..."
                className="h-9 text-xs flex-1 border-border focus-visible:ring-ring bg-muted text-foreground"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                autoFocus
            />
            <Button size="sm" onClick={handleSubmit} disabled={isLoading || !url} className="h-9 w-9 p-0 shrink-0 rounded-xl">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUp className="w-4 h-4" />}
            </Button>
        </div>
    );
}

export function TextForm({ onAdd, isLoading }: FormProps) {
    const [text, setText] = useState("");

    const handleSubmit = () => {
        if (!text) return;
        onAdd('text', { text }, 2, 1);
    };

    return (
        <div className="w-[300px] flex items-center gap-2">
            <Input
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Enter text..."
                className="h-9 text-xs flex-1 border-border focus-visible:ring-ring bg-muted text-foreground"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                autoFocus
            />
            <Button size="sm" onClick={handleSubmit} disabled={isLoading || !text} className="h-9 w-9 p-0 shrink-0 rounded-xl">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUp className="w-4 h-4" />}
            </Button>
        </div>
    );
}

export function SectionForm({ onAdd, isLoading }: FormProps) {
    const [text, setText] = useState("");

    const handleSubmit = () => {
        if (!text) return;
        onAdd('section-title', { text }, 8, 1);
    };

    return (
        <div className="w-[300px] flex items-center gap-2">
            <Input
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Section Title..."
                className="h-9 text-xs flex-1 border-border focus-visible:ring-ring bg-muted text-foreground"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                autoFocus
            />
            <Button size="sm" onClick={handleSubmit} disabled={isLoading || !text} className="h-9 w-9 p-0 shrink-0 rounded-xl">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUp className="w-4 h-4" />}
            </Button>
        </div>
    );
}

export function CustomForm({ onAdd, isLoading, themeConfig }: FormProps) {
    const [text, setText] = useState("");

    const handleSubmit = () => {
        if (!text) return;
        onAdd('custom', { text }, 4, 2);
    };

    return (
        <div className="w-[400px] p-1 flex flex-col gap-2">
            <div className="flex justify-between items-end mb-2">
                <Label className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-1">Custom Code</Label>
                <div className="scale-75 origin-right">
                    <SyntaxGuideDialog themeConfig={themeConfig} />
                </div>
            </div>
            <Textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder={`{{project ...}}\n<div class="bg-red-500">...</div>`}
                className="h-48 text-xs font-mono resize-none focus-visible:ring-ring bg-muted text-foreground border-border"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        handleSubmit();
                    }
                }}
            />
            <div className="flex justify-between items-center pt-1">
                <span className="text-[10px] text-muted-foreground">Ctrl + Enter to submit</span>
                <Button size="sm" onClick={handleSubmit} disabled={isLoading || !text}>
                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Add Code"}
                </Button>
            </div>
        </div>
    );
}

export function InfoCardForm({ onAdd, isLoading }: FormProps) {
    const [name, setName] = useState("Kita User");
    const [bio, setBio] = useState("Digital creator building cool things.");
    const [twitter, setTwitter] = useState("");
    const [github, setGithub] = useState("");
    const [portfolio, setPortfolio] = useState("");

    const handleSubmit = () => {
        if (!name) return;

        let socials = "";
        if (twitter) socials += `${twitter},`;
        if (github) socials += `${github},`;

        // We use the {{profile}} shortcode which maps to our new design in CustomModule
        const shortcode = `{{profile name="${name}" bio="${bio}" badges="Pro,Dev" socials="${socials}" link="${portfolio}" linkText="${portfolio ? 'kita.zone/me' : ''}"}}`;
        onAdd('custom', { text: shortcode }, 4, 3); // 4x3 Grid (Large Card)
    };

    return (
        <div className="w-[320px] p-1 flex flex-col gap-3">
            <div className="space-y-1">
                <Label className="text-xs">Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
                <Label className="text-xs">Bio</Label>
                <Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Short bio..." className="h-16 text-xs resize-none" />
            </div>
            <div className="space-y-1">
                <Label className="text-xs">Twitter / GitHub (URLs)</Label>
                <div className="flex gap-2">
                    <Input value={twitter} onChange={e => setTwitter(e.target.value)} placeholder="Twitter URL" className="h-8 text-xs" />
                    <Input value={github} onChange={e => setGithub(e.target.value)} placeholder="GitHub URL" className="h-8 text-xs" />
                </div>
            </div>
            <div className="space-y-1">
                <Label className="text-xs">Portfolio Link</Label>
                <Input value={portfolio} onChange={e => setPortfolio(e.target.value)} placeholder="https://..." className="h-8 text-xs" />
            </div>
            <div className="flex justify-end pt-2">
                <Button size="sm" onClick={handleSubmit} disabled={isLoading || !name}>
                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Add Info Card"}
                </Button>
            </div>
        </div>
    );
}
