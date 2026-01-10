import { Link as LinkIcon, Image as ImageIcon, Type, Heading, Code } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModulePicker } from "./ModulePicker";

type ToolType = 'text' | 'link' | 'image' | 'section-title' | 'project' | 'metric' | 'badge' | 'custom' | 'info-card' | 'social' | null;

interface ModuleToolbarProps {
    activeTool: ToolType;
    onToggle: (tool: ToolType, data?: any) => void;
}

export function ModuleToolbar({ activeTool, onToggle }: ModuleToolbarProps) {
    return (
        <>
            <div className="w-px h-8 bg-border/50 mx-2" />

            {/* Core Essentials */}
            <div className="flex items-center gap-1">
                <ToolbarButton icon={LinkIcon} active={activeTool === 'link'} onClick={() => onToggle('link')} label="Link" />
                <ToolbarButton icon={ImageIcon} active={activeTool === 'image'} onClick={() => onToggle('image')} label="Image" />
                <ToolbarButton icon={Type} active={activeTool === 'text'} onClick={() => onToggle('text')} label="Text" />
            </div>

            <div className="w-px h-6 bg-border/50 mx-1" />

            {/* Structure */}
            <ToolbarButton icon={Heading} active={activeTool === 'section-title'} onClick={() => onToggle('section-title')} label="Section Title" />

            <div className="w-px h-6 bg-border/50 mx-1" />

            {/* Rich Module Picker (Replaces simple dropdown) */}
            <ModulePicker onSelect={onToggle} />
        </>
    );
}

export function CustomCodeButton({ active, onToggle }: { active: boolean, onToggle: () => void }) {
    return (
        <ToolbarButton icon={Code} active={active} onClick={onToggle} label="Custom Code" />
    );
}

// Reusable Button Logic
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
