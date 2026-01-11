import {
    Search, Folder, List, Hash, Tag, Heading,
    Instagram, Twitter, Youtube, Music, Github, CheckSquare,
    Link as LinkIcon, Image as ImageIcon, Type, Smartphone, Code
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ToolType } from "../types";

interface ModuleDef {
    id: string;
    label: string;
    icon: any;
    type: ToolType;
    data?: any;
    previewColor: string;
    previewContent: React.ReactNode;
}

interface ModulePickerProps {
    onSelect: (tool: ToolType, data?: any) => void;
}

export function ModulePicker({ onSelect }: ModulePickerProps) {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

    const handleSelect = (tool: ToolType, data?: any) => {
        onSelect(tool, data);
        setOpen(false);
    };

    const modules: ModuleDef[] = [
        // --- Info / Productivity ---
        {
            id: 'project',
            label: 'Project List',
            icon: List,
            type: 'project' as ToolType,
            previewColor: 'bg-zinc-900 border border-zinc-800',
            previewContent: (
                <div className="flex flex-col gap-2 p-3 w-full h-full">
                    <div className="flex items-center gap-3 p-2 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                        <div className="flex flex-col gap-1.5 flex-1">
                            <div className="w-20 h-2 bg-zinc-300 rounded-full" />
                            <div className="w-12 h-1.5 bg-zinc-500 rounded-full" />
                        </div>
                        <div className="w-8 h-8 bg-zinc-700 rounded-md border border-zinc-600" />
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-zinc-800/50 rounded-lg border border-zinc-700/50 opacity-50">
                        <div className="flex flex-col gap-1.5 flex-1">
                            <div className="w-16 h-2 bg-zinc-400 rounded-full" />
                            <div className="w-10 h-1.5 bg-zinc-600 rounded-full" />
                        </div>
                        <div className="w-8 h-8 bg-zinc-700 rounded-md border border-zinc-600" />
                    </div>
                </div>
            )
        },
        {
            id: 'info-card',
            label: 'Info Card',
            icon: Smartphone,
            type: 'info-card' as ToolType,
            previewColor: 'bg-zinc-950 border border-zinc-800',
            previewContent: (
                <div className="flex flex-col w-full h-full p-4 justify-between">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <div className="w-20 h-3 bg-white rounded-full" />
                            <div className="flex gap-1">
                                <div className="w-6 h-2.5 bg-amber-500/20 rounded-full border border-amber-500/30" />
                                <div className="w-6 h-2.5 bg-zinc-800 rounded-full border border-zinc-700" />
                            </div>
                        </div>
                        <div className="w-24 h-2 bg-zinc-600 rounded-full" />
                    </div>
                    <div className="w-full h-px bg-zinc-800/50" />
                    <div className="flex items-center justify-between">
                        <div className="w-10 h-1.5 bg-zinc-700 rounded-full" />
                        <div className="w-14 h-1.5 bg-white/50 rounded-full" />
                    </div>
                </div>
            )
        },

        // --- Visual / Metrics ---
        {
            id: 'metric',
            label: 'Metric',
            icon: Hash,
            type: 'metric' as ToolType,
            previewColor: 'bg-blue-950/50 border border-blue-900/50',
            previewContent: (
                <div className="flex flex-col items-center justify-center h-full w-full gap-1">
                    <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Revenue</span>
                    <span className="text-xl font-black text-blue-500">$12k</span>
                </div>
            )
        },
        {
            id: 'badge',
            label: 'Badge',
            icon: Tag,
            type: 'badge' as ToolType,
            previewColor: 'bg-amber-950/30 border border-amber-900/50',
            previewContent: (
                <div className="flex items-center justify-center h-full w-full">
                    <div className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-bold border border-amber-500/20 shadow-sm">
                        New
                    </div>
                </div>
            )
        },
        {
            id: 'custom',
            label: 'Custom Code',
            icon: Code,
            type: 'custom' as ToolType,
            previewColor: 'bg-zinc-950 border border-zinc-800',
            previewContent: (
                <div className="flex items-center justify-center h-full w-full text-zinc-600 font-mono text-sm font-bold">
                    {'</>'}
                </div>
            )
        },
        {
            id: 'spotify-playlist',
            label: 'Spotify Playlist',
            icon: Music,
            type: 'spotify-playlist' as ToolType,
            previewColor: 'bg-[#1DB954]/10 border border-[#1DB954]/20',
            previewContent: (
                <div className="flex flex-col items-center justify-center h-full w-full gap-2">
                    <div className="w-10 h-10 bg-[#1DB954] rounded-full flex items-center justify-center text-black shadow-lg shadow-[#1DB954]/20">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 14.82 1.08.54.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.24z" />
                        </svg>
                    </div>
                </div>
            )
        },
    ];

    const filteredModules = modules.filter(m => m.label.toLowerCase().includes(search.toLowerCase()));

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    className={cn(
                        "p-3 rounded-full transition-all duration-200 group relative outline-none",
                        "hover:bg-muted text-muted-foreground hover:text-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
                    )}
                    title="More Modules"
                >
                    <Folder className="w-5 h-5" />
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-xl p-0 gap-0 overflow-hidden bg-[#1a1a1a] border-zinc-800 text-white shadow-2xl rounded-3xl">
                <DialogTitle className="sr-only">Select Module</DialogTitle>
                <div className="p-4 border-b border-zinc-800">
                    <div className="bg-zinc-800/50 rounded-xl flex items-center px-3 py-2 gap-2 border border-zinc-700/50 focus-within:border-zinc-500 transition-colors">
                        <Search className="w-4 h-4 text-zinc-400" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search modules..."
                            className="border-none bg-transparent h-auto p-0 text-sm placeholder:text-zinc-500 focus-visible:ring-0 text-white"
                        />
                    </div>
                </div>

                <div className="p-4 grid grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto">
                    {filteredModules.map((module) => (
                        <button
                            key={module.id}
                            onClick={() => handleSelect(module.type, module.data)}
                            className="group flex flex-col items-center gap-2"
                        >
                            <div className={cn(
                                "w-full aspect-[4/3] rounded-2xl overflow-hidden relative shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg ring-1 ring-white/5",
                                module.previewColor
                            )}>
                                {module.previewContent}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                            </div>
                            <span className="text-xs text-zinc-400 font-medium group-hover:text-white transition-colors">
                                {module.label}
                            </span>
                        </button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
