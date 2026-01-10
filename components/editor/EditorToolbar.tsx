'use client';

import { Button } from "@/components/ui/button";
import { BarChart3, Eye, Users, Smartphone, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createModule } from "@/actions/modules";
import { getPageAnalytics } from "@/actions/analytics";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ProjectForm, ImageForm, LinkForm, TextForm, MetricForm, BadgeForm, SectionForm, CustomForm, InfoCardForm, SocialForm } from "./ModuleForms";
import { ModuleToolbar, CustomCodeButton } from "@/components/editor/modules/ModuleToolbar";

interface EditorToolbarProps {
    pageId: string;
    themeConfig?: any;
    onAdd?: (type: string, content: any, w: number, h: number) => void;
}

type ToolType = 'text' | 'link' | 'image' | 'section-title' | 'project' | 'metric' | 'badge' | 'custom' | 'info-card' | 'social' | null;

export function EditorToolbar({ pageId, themeConfig, onAdd }: EditorToolbarProps) {
    const router = useRouter();
    const [activeTool, setActiveTool] = useState<ToolType>(null);
    const [activeData, setActiveData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [analyticsData, setAnalyticsData] = useState({ views: 0, recentViews: 0 });
    const inputWrapperRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (inputWrapperRef.current && !inputWrapperRef.current.contains(event.target as Node)) {
                // Don't close if clicking a toolbar button
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch Analytics when dialog opens
    useEffect(() => {
        if (showAnalytics) {
            getPageAnalytics(pageId).then(data => setAnalyticsData(data));
        }
    }, [showAnalytics, pageId]);

    const handleCreateModule = async (type: string, content: any, w: number = 2, h: number = 2) => {
        setIsLoading(true);
        try {
            if (onAdd) {
                // Client-side mode
                onAdd(type, content, w, h);
            } else {
                // Server-side mode
                await createModule(pageId, type, 0, 0, content, w, h);
                router.refresh();
            }
            setActiveTool(null);
            setActiveData(null);
        } catch (error) {
            console.error("Failed to create module:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleTool = (tool: ToolType, data?: any) => {
        if (activeTool === tool && !data) {
            setActiveTool(null);
            setActiveData(null);
        } else {
            setActiveTool(tool);
            setActiveData(data || null);
        }
    };

    const renderForm = () => {
        const props = { onAdd: handleCreateModule, isLoading, themeConfig, initialData: activeData };
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
            case 'social': return <SocialForm {...props} />;
            default: return null;
        }
    };


    const themeClass = themeConfig?.cssClass || "";
    const isDarkMode = themeClass.includes('dark') || (!themeConfig?.backgroundColor && themeClass.includes('dark')); // heuristic

    // We wrap the internal parts with the theme class so variables allow the colors to change
    const toolbarThemeClass = cn(themeClass, isDarkMode ? "dark" : "");

    return (
        <div className={cn("fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4 max-w-[calc(100vw-2rem)]", toolbarThemeClass)}>

            {/* Input Bubble / Popover */}
            <div
                ref={inputWrapperRef}
                className={cn(
                    "bg-popover/60 backdrop-blur-xl rounded-3xl shadow-2xl p-2 transition-all duration-300 origin-bottom transform absolute bottom-full mb-4 ring-1 ring-border/5",
                    activeTool ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 translate-y-4 pointer-events-none"
                )}
            >
                {activeTool && !['link', 'image', 'text', 'section-title'].includes(activeTool) && (
                    <div className="flex items-center justify-between px-2 mb-2 pt-1 border-b border-white/5 pb-2 mx-1">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            {(activeTool === 'info-card' ? 'Info Card' :
                                activeTool === 'project' ? 'Project List' :
                                    activeTool === 'metric' ? 'Metric' :
                                        activeTool === 'badge' ? 'Badge' :
                                            activeTool === 'social' ? 'Social' :
                                                activeTool === 'custom' ? 'Custom' : 'Module')}
                        </span>
                        <button
                            onClick={() => {
                                setActiveTool(null);
                                setActiveData(null);
                            }}
                            className="p-1 hover:bg-white/10 text-muted-foreground hover:text-foreground rounded-full transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
                {activeTool && renderForm()}
            </div>

            <div className="flex items-center gap-3">
                {/* Main Toolbar */}
                <div className="bg-popover/50 backdrop-blur-2xl p-2 pl-4 rounded-full shadow-2xl flex items-center gap-2 ring-1 ring-border/5 overflow-x-auto max-w-full no-scrollbar">
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

                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-10 h-10 rounded-full hover:bg-muted shrink-0 ml-1"
                        onClick={() => setShowAnalytics(true)}
                        title="Analytics"
                    >
                        <BarChart3 className="w-5 h-5 text-muted-foreground" />
                    </Button>

                    {/* Integrated Modules Toolbar (with Dropdown) */}
                    <ModuleToolbar activeTool={activeTool as any} onToggle={toggleTool as any} />
                </div>



                {/* Mobile Preview Toggle */}
                <div className="bg-popover/50 backdrop-blur-2xl p-2 rounded-full shadow-2xl flex items-center ring-1 ring-border/5">
                    <MobilePreviewToggle />
                </div>
            </div>

            {/* Analytics Dialog */}
            <Dialog open={showAnalytics} onOpenChange={setShowAnalytics}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Page Analytics</DialogTitle>
                        <DialogDescription>Traffic stats for the last 30 days (Real-time).</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="p-4 rounded-2xl bg-secondary/30 border border-border flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-wider">
                                <Eye className="w-4 h-4" /> Views
                            </div>
                            <span className="text-3xl font-black">{analyticsData.views}</span>
                            <span className="text-xs text-muted-foreground font-medium">Total Views</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-secondary/30 border border-border flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-wider">
                                <Users className="w-4 h-4" /> Recent
                            </div>
                            <span className="text-3xl font-black">{analyticsData.recentViews}</span>
                            <span className="text-xs text-green-500 font-medium">Last 30 Days</span>
                        </div>
                        {/* 
                        <div className="col-span-2 p-4 rounded-2xl bg-secondary/10 border border-border h-32 flex items-center justify-center text-muted-foreground text-sm">
                            (Graph Placeholder: Traffic Over Time)
                        </div>
                        */}
                    </div>
                </DialogContent>
            </Dialog>
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

// Local ToolbarButton for MobilePreviewToggle compat
function ToolbarButton({ icon: Icon, active, onClick, label }: { icon: any, active: boolean, onClick: () => void, label: string }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "p-3 rounded-full transition-all duration-200 group relative outline-none",
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
