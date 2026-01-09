'use client';

import { Button } from "@/components/ui/button";
import { Link as LinkIcon, Image as ImageIcon, Plus, X, Type, Heading, List, Hash, Tag, Lightbulb, Code, Smartphone } from "lucide-react";
import { createModule } from "@/actions/modules";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ProjectForm, ImageForm, LinkForm, TextForm, MetricForm, BadgeForm, SectionForm, CustomForm, InfoCardForm } from "./ModuleForms";

interface EditorToolbarProps {
    pageId: string;
    themeConfig?: any;
}

type ToolType = 'text' | 'link' | 'image' | 'section-title' | 'project' | 'metric' | 'badge' | 'custom' | 'info-card' | null;

export function EditorToolbar({ pageId, themeConfig }: EditorToolbarProps) {
    const router = useRouter();
    const [activeTool, setActiveTool] = useState<ToolType>(null);
    const [isLoading, setIsLoading] = useState(false);
    const inputWrapperRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (inputWrapperRef.current && !inputWrapperRef.current.contains(event.target as Node)) {
                // Check if click was on a toolbar button (which toggles it), if so let toggle handle it
                // We can't easily check that here without more refs, but toggle logic handles "if active == tool -> null".
                // So if we click outside the bubble but ON the toolbar, we might want to let the button handle it.
                // For now, let's strictly close if clicking "background".
                // Actually, let's NOT close on click outside immediately, let the user close it explicitly or via toggle.
                // It's less annoying.
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCreateModule = async (type: string, content: any, w: number = 2, h: number = 2) => {
        setIsLoading(true);
        try {
            await createModule(pageId, type, 0, 0, content, w, h);
            router.refresh();
            setActiveTool(null);
        } catch (error) {
            console.error("Failed to create module:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleTool = (tool: ToolType) => {
        setActiveTool(prev => prev === tool ? null : tool);
    };

    // Map tools to their form components
    const renderForm = () => {
        const props = { onAdd: handleCreateModule, isLoading, themeConfig };
        switch (activeTool) {
            case 'project': return <ProjectForm {...props} />;
            case 'metric': return <MetricForm {...props} />;
            case 'badge': return <BadgeForm {...props} />;

            case 'image': return <ImageForm {...props} />;
            case 'link': return <LinkForm {...props} />;
            case 'text': return <TextForm {...props} />;
            case 'section-title': return <SectionForm {...props} />;
            case 'custom': return <CustomForm {...props} />;
            case 'info-card': return <InfoCardForm {...props} />;
            default: return null;
        }
    };

    const themeClass = themeConfig?.cssClass || "";
    const isDarkMode = themeClass.includes('dark') || (!themeConfig?.backgroundColor && themeClass.includes('dark')); // heuristic

    // We wrap the internal parts with the theme class so variables allow the colors to change
    const toolbarThemeClass = cn(themeClass, isDarkMode ? "dark" : "");

    return (
        <div className={cn("fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4", toolbarThemeClass)}>

            {/* Input Bubble / Popover */}
            <div
                ref={inputWrapperRef}
                className={cn(
                    "bg-popover/60 backdrop-blur-xl rounded-3xl shadow-2xl p-2 transition-all duration-300 origin-bottom transform absolute bottom-full mb-4 ring-1 ring-border/5",
                    activeTool ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 translate-y-4 pointer-events-none"
                )}
            >
                {activeTool && renderForm()}
            </div>

            <div className="flex items-center gap-3">
                {/* Main Toolbar */}
                <div className="bg-popover/50 backdrop-blur-2xl p-2 pl-4 rounded-full shadow-2xl flex items-center gap-2 ring-1 ring-border/5">
                    <Button
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            const btn = document.getElementById('share-btn-text');
                            if (btn) btn.innerText = "Copied!";
                            setTimeout(() => {
                                if (btn) btn.innerText = "Share my Kita";
                            }, 2000);
                        }}
                        className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 shadow-md transition-all active:scale-95"
                    >
                        <span id="share-btn-text">Share my Kita</span>
                    </Button>

                    <div className="w-px h-8 bg-border/50 mx-2" />

                    <div className="flex items-center gap-1">
                        <ToolbarButton icon={LinkIcon} active={activeTool === 'link'} onClick={() => toggleTool('link')} label="Link" />
                        <ToolbarButton icon={ImageIcon} active={activeTool === 'image'} onClick={() => toggleTool('image')} label="Image" />
                        <ToolbarButton icon={Type} active={activeTool === 'text'} onClick={() => toggleTool('text')} label="Text" />
                    </div>

                    <div className="w-px h-6 bg-border/50 mx-1" />

                    <div className="flex items-center gap-1">
                        <ToolbarButton icon={Smartphone} active={activeTool === 'info-card'} onClick={() => toggleTool('info-card')} label="Info Card" />
                        <ToolbarButton icon={List} active={activeTool === 'project'} onClick={() => toggleTool('project')} label="Project List" />
                        <ToolbarButton icon={Hash} active={activeTool === 'metric'} onClick={() => toggleTool('metric')} label="Metric" />
                        <ToolbarButton icon={Tag} active={activeTool === 'badge'} onClick={() => toggleTool('badge')} label="Badge" />

                    </div>

                    <div className="w-px h-6 bg-border/50 mx-1" />

                    <div className="flex items-center gap-1">
                        <ToolbarButton icon={Heading} active={activeTool === 'section-title'} onClick={() => toggleTool('section-title')} label="Section Title" />
                    </div>
                </div>

                <div className="bg-popover/50 backdrop-blur-2xl p-2 rounded-full shadow-2xl flex items-center ring-1 ring-border/5">
                    <ToolbarButton icon={Code} active={activeTool === 'custom'} onClick={() => toggleTool('custom')} label="Custom Code" />
                </div>

                {/* Mobile Preview Toggle */}
                <div className="bg-popover/50 backdrop-blur-2xl p-2 rounded-full shadow-2xl flex items-center ring-1 ring-border/5">
                    <MobilePreviewToggle />
                </div>
            </div>
        </div>
    );
}

function MobilePreviewToggle() {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (isActive) {
            document.body.classList.add('mobile-preview-active');
        } else {
            document.body.classList.remove('mobile-preview-active');
        }
        return () => document.body.classList.remove('mobile-preview-active');
    }, [isActive]);

    return (
        <ToolbarButton
            icon={Smartphone}
            active={isActive}
            onClick={() => setIsActive(!isActive)}
            label="Mobile Preview"
        />
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
