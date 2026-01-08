'use client';

import { cn } from "@/lib/utils";
import { updateModulePosition, deleteModule } from "@/actions/modules";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface ModuleResizeToolbarProps {
    module: {
        id: string;
        x: number;
        y: number;
        w: number;
        h: number;
    };
}

export function ModuleResizeToolbar({ module }: ModuleResizeToolbarProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleResize = async (w: number, h: number) => {
        setIsLoading(true);
        try {
            await updateModulePosition(module.id, module.x, module.y, w, h);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Delete this module?")) return;
        setIsLoading(true);
        try {
            await deleteModule(module.id);
        } finally {
            setIsLoading(false);
        }
    }

    // Custom SVG Icons for Layouts (Filled Style)
    // Ratios based on User "Units": 
    // Square 1x1 (Grid 2x2)
    // Tall 1x2 (Grid 2x4)
    // Large 3x4 (Grid 6x8)
    // Wide 4x4 (Grid 8x8)
    const LayoutIcon = ({ type, active }: { type: 'square' | 'wide' | 'tall' | 'large', active?: boolean }) => {
        const fillColor = active ? "white" : "#78716c"; // stone-500

        return (
            <div className={cn(
                "w-7 h-7 rounded flex items-center justify-center transition-all",
                active ? "" : "hover:bg-white/10"
            )}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Square 1:1 (Visual) */}
                    {type === 'square' && (
                        <rect x="5" y="5" width="6" height="6" rx="1" fill={fillColor} />
                    )}
                    {/* Tall 1:2 */}
                    {type === 'tall' && (
                        <rect x="5" y="2" width="6" height="12" rx="1" fill={fillColor} />
                    )}
                    {/* Large 3:4 */}
                    {type === 'large' && (
                        <rect x="3" y="1" width="10" height="14" rx="1" fill={fillColor} />
                    )}
                    {/* Wide 4:4 (Full) */}
                    {type === 'wide' && (
                        <rect x="1" y="1" width="14" height="14" rx="1" fill={fillColor} />
                    )}
                </svg>
            </div>
        );
    };

    return (
        <div
            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#1a1a1a] text-white rounded-full px-3 py-2 flex items-center gap-2 shadow-xl z-50 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 origin-bottom"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
        >
            <button onClick={() => handleResize(1, 2)} title="Square (1x1)">
                <LayoutIcon type="square" active={module.w === 1 && module.h === 2} />
            </button>
            <button onClick={() => handleResize(2, 6)} title="Tall (1x2)">
                <LayoutIcon type="tall" active={module.w === 2 && module.h === 6} />
            </button>
            <button onClick={() => handleResize(3, 6)} title="Large (3x4)">
                <LayoutIcon type="large" active={module.w === 3 && module.h === 6} />
            </button>
            <button onClick={() => handleResize(4, 4)} title="Wide (4x4)">
                <LayoutIcon type="wide" active={module.w === 4 && module.h === 4} />
            </button>

            <div className="w-px h-4 bg-stone-700 mx-1" />

            <button onClick={handleDelete} className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10 text-stone-400 hover:text-red-400 transition-colors">
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
}
