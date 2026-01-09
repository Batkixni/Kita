'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Type, Link as LinkIcon, Image as ImageIcon, Briefcase, X, Check, ArrowUp, Heading, Code } from "lucide-react";
import { createModule } from "@/actions/modules";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface EditorToolbarProps {
    pageId: string;
}

type ToolType = 'text' | 'link' | 'image' | 'portfolio' | 'section-title' | 'custom' | null;

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

export function EditorToolbar({ pageId }: EditorToolbarProps) {
    const router = useRouter();
    const [activeTool, setActiveTool] = useState<ToolType>(null);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when tool opens
    useEffect(() => {
        if (activeTool && inputRef.current) {
            inputRef.current.focus();
        }
    }, [activeTool]);

    const handleAddModule = async () => {
        if (!activeTool) return;
        if (!inputValue.trim()) return;

        setIsLoading(true);
        try {
            // For link modules, we pass the URL as content
            // For text/portfolio, pass text
            // For image, pass src
            const content = activeTool === 'link' ? { url: inputValue } :
                activeTool === 'image' ? { src: inputValue, alt: 'Image' } :
                    activeTool === 'custom' ? { text: inputValue } :
                        { text: inputValue };

            const w = activeTool === 'section-title' ? 4 : 0; // Default full width (or 4 units which is half in 8-col grid, let's see. User said "entire row" usually implies full width. But 8 cols... let's check grid default. A "row" might be activeTool w/h logic).
            // Actually createModule default takes 0,0 and backend handles defaults. 
            // But for section title, we want it explicitly wide and short.
            // Let's pass 8 for width (full width) and 1 for height.
            const initialW = activeTool === 'section-title' ? 8 : activeTool === 'custom' ? 4 : 0;
            const initialH = activeTool === 'section-title' ? 1 : activeTool === 'custom' ? 2 : 0;

            await createModule(pageId, activeTool, 0, 0, content, initialW, initialH);
            router.refresh();
            setActiveTool(null);
            setInputValue("");
        } catch (error) {
            console.error("Failed to create module:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleTool = (tool: ToolType) => {
        if (activeTool === tool) {
            setActiveTool(null);
        } else {
            setActiveTool(tool);
            setInputValue("");
        }
    };

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4">

            {/* Input Bubble */}
            <div className={cn(
                "bg-popover border border-border rounded-2xl shadow-xl p-3 flex gap-2 transition-all duration-300 origin-bottom transform",
                activeTool === 'custom' ? "items-start" : "items-center",
                activeTool ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4 pointer-events-none absolute bottom-full mb-4"
            )}>
                <div className="relative">
                    {activeTool === 'custom' ? (
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center pl-1">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Custom Code</span>
                                <select
                                    className="text-xs h-6 rounded border border-border bg-muted px-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer hover:bg-muted/80 transition-colors"
                                    onChange={(e) => {
                                        const t = TEMPLATES.find(t => t.label === e.target.value);
                                        if (t) setInputValue(prev => (prev ? prev + "\n\n" : "") + t.content);
                                        e.target.value = "";
                                    }}
                                >
                                    <option value="">+ Add Template</option>
                                    {TEMPLATES.map(t => <option key={t.label} value={t.label}>{t.label}</option>)}
                                </select>
                            </div>
                            <textarea
                                ref={inputRef as any}
                                placeholder={`{{project title="My Project" desc="..."}}\n{{metric label="Revenue" value="$1K"}}`}
                                className="w-[400px] h-48 p-3 text-xs font-mono border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-muted resize-none leading-relaxed shadow-inner text-foreground placeholder:text-muted-foreground"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                        handleAddModule();
                                    }
                                }}
                            />
                            <div className="flex justify-end pr-1">
                                <span className="text-[10px] text-muted-foreground font-medium px-1.5 py-0.5 bg-muted rounded border border-border">Ctrl + Enter</span>
                            </div>
                        </div>
                    ) : (
                        <Input
                            ref={inputRef}
                            placeholder={
                                activeTool === 'link' ? "Paste link here..." :
                                    activeTool === 'image' ? "Image URL..." :
                                        "Enter text..."
                            }
                            className="w-96 border-border focus-visible:ring-ring bg-muted text-foreground"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddModule()}
                        />
                    )}
                </div>
                <Button
                    size="icon"
                    className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shrink-0"
                    onClick={handleAddModule}
                    disabled={isLoading || !inputValue.trim()}
                >
                    {isLoading ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <ArrowUp className="w-4 h-4" />}
                </Button>
            </div>

            <div className="flex items-center gap-3">
                {/* Main Toolbar */}
                <div className="bg-popover/90 backdrop-blur-xl border border-border p-2 pl-4 rounded-full shadow-2xl flex items-center gap-2 ring-1 ring-border/5">
                    <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 shadow-md transition-all">
                        Share my Kita
                    </Button>

                    <div className="w-px h-8 bg-stone-200 mx-2" />

                    <div className="flex items-center gap-1">
                        <ToolbarButton icon={LinkIcon} active={activeTool === 'link'} onClick={() => toggleTool('link')} label="Link" />
                        <ToolbarButton icon={ImageIcon} active={activeTool === 'image'} onClick={() => toggleTool('image')} label="Image" />
                        <ToolbarButton icon={Type} active={activeTool === 'text'} onClick={() => toggleTool('text')} label="Text" />
                        <ToolbarButton icon={Heading} active={activeTool === 'section-title'} onClick={() => toggleTool('section-title')} label="Section Title" />
                        <ToolbarButton icon={Briefcase} active={activeTool === 'portfolio'} onClick={() => toggleTool('portfolio')} label="Portfolio" />
                    </div>
                </div>

                {/* Independent Custom Button */}
                <div className="bg-popover/90 backdrop-blur-xl border border-border p-2 rounded-full shadow-2xl flex items-center ring-1 ring-border/5">
                    <ToolbarButton icon={Code} active={activeTool === 'custom'} onClick={() => toggleTool('custom')} label="Custom Code" />
                </div>
            </div>
        </div>
    );
}

function ToolbarButton({ icon: Icon, active, onClick, label }: { icon: any, active: boolean, onClick: () => void, label: string }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "p-3 rounded-full transition-all duration-200 group relative",
                active ? "bg-accent text-accent-foreground scale-110" : "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
            title={label}
        >
            <Icon className="w-5 h-5" />

            {/* Tooltip/Label */}
            <span className={cn(
                "absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded-lg opacity-0 transition-opacity whitespace-nowrap pointer-events-none",
                !active && "group-hover:opacity-100"
            )}>
                {label}
            </span>

            {/* Active Indicator dot */}
            {active && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-foreground rounded-full" />
            )}
        </button>
    )
}
