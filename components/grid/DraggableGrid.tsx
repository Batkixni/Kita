'use client';

import React, { useEffect, useState, useRef } from 'react';
import * as RGL from "react-grid-layout";
import { GridItem } from "./GridItem";
import { LinkModule } from "../modules/LinkModule";
import { ImageModule } from "../modules/ImageModule";
import { TextModule } from "../modules/TextModule";
import { PortfolioModule } from "../modules/PortfolioModule";
import { SectionTitleModule } from "../modules/SectionTitleModule";
import { CustomModule } from "../modules/CustomModule";
import { EditModuleDialog } from "../editor/EditModuleDialog";
import { ModuleResizeToolbar } from "../editor/ModuleResizeToolbar";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { deleteModule } from "@/actions/modules";

// Custom WidthProvider
function withWidth(ComposedComponent: any) {
    return function WidthProvider(props: any) {
        const [width, setWidth] = useState(1200);
        const elementRef = useRef<HTMLDivElement>(null);
        const mounted = useRef(false);

        useEffect(() => {
            mounted.current = true;
            if (elementRef.current) {
                setWidth(elementRef.current.offsetWidth);
            }

            const resizeObserver = new ResizeObserver((entries) => {
                if (!mounted.current) return;
                for (let entry of entries) {
                    setWidth(entry.contentRect.width);
                }
            });

            if (elementRef.current) {
                resizeObserver.observe(elementRef.current);
            }

            return () => {
                mounted.current = false;
                resizeObserver.disconnect();
            };
        }, []);

        return (
            <div ref={elementRef} className={props.className} style={{ width: '100%', ...props.style }}>
                <ComposedComponent {...props} width={width} />
            </div>
        );
    };
}

// Robustly get the Responsive component
const getResponsive = () => {
    const rglAny = RGL as any;
    // Check various export patterns
    if (rglAny.Responsive) return rglAny.Responsive;
    if (rglAny.ResponsiveGridLayout) return rglAny.ResponsiveGridLayout;
    if (rglAny.default) {
        if (rglAny.default.Responsive) return rglAny.default.Responsive;
        if (rglAny.default.ResponsiveGridLayout) return rglAny.default.ResponsiveGridLayout;
    }
    return undefined;
};

const ResponsiveGridLayout = getResponsive();
const ResponsiveReactGridLayout = ResponsiveGridLayout ? withWidth(ResponsiveGridLayout) : null;

interface DraggableGridProps {
    items: any[];
    isEditable?: boolean;
    onLayoutChange?: (layout: any[]) => void;
    theme?: any;
}

const ModuleRenderer = ({ item, isEditable }: { item: any, isEditable: boolean }) => {
    switch (item.type) {
        case 'link':
            return (
                <LinkModule
                    url={item.content?.url}
                    w={item.w}
                    h={item.h}
                    customTitle={item.content?.customTitle}
                    customDesc={item.content?.customDesc}
                    customImage={item.content?.customImage}
                    customFavicon={item.content?.customFavicon}
                    isEditable={isEditable}
                />
            );
        case 'image':
            return <ImageModule src={item.content?.src} alt={item.content?.alt} />;
        case 'text':
            return <TextModule text={item.content?.text} />;
        case 'portfolio':
            return <PortfolioModule content={item.content?.text} />;
        case 'section-title':
            return <SectionTitleModule title={item.content?.text} />;
        case 'custom':
            return <CustomModule content={item.content?.text} isEditable={isEditable} />;
        default:
            return <div className="p-4 rounded-xl bg-red-50 text-red-500">Unknown module</div>;
    }
};

export function DraggableGrid({ items, isEditable = false, onLayoutChange, theme }: DraggableGridProps) {
    const [editingModule, setEditingModule] = useState<any>(null);
    const [width, setWidth] = useState(1200);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Grid Configuration
    // Using 8 columns for finer control, but mapping "1x1" user unit = 2x2 grid units.
    const cols = { lg: 8, md: 8, sm: 8, xs: 4, xxs: 2 };

    // Calculate current column count based on width
    const getCols = (w: number) => {
        if (w >= 1200) return cols.lg;
        if (w >= 996) return cols.md;
        if (w >= 768) return cols.sm;
        if (w >= 480) return cols.xs;
        return cols.xxs;
    };

    const currentCols = getCols(width);
    // RGL width calculation logic:
    // colWidth = (containerWidth - margin[0] * (cols - 1) - containerPadding[0] * 2) / cols
    // We assume containerPadding = margin = [16, 16]
    // So total deducted space = 16 * (cols - 1) + 16 * 2 = 16 * (cols + 1)
    const rowHeight = (width - (currentCols + 1) * 16) / currentCols;

    // Width Observer
    useEffect(() => {
        if (!containerRef.current) return;
        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setWidth(entry.contentRect.width);
            }
        });
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    // Debug logging
    useEffect(() => {
        if (!ResponsiveGridLayout) {
            console.error("React-Grid-Layout 'Responsive' component failed to load. Exports:", RGL);
        }
    }, []);

    // Sort items by Y then X to ensure animation order follows visual order (Top -> Bottom)
    const sortedItems = [...items].sort((a, b) => {
        if (a.y !== b.y) return a.y - b.y;
        return a.x - b.x;
    });

    // Map items to layout format
    const layout = sortedItems.map(item => ({
        i: item.id,
        x: item.x,
        y: item.y,
        w: item.w || 2, // Default to 2 if 0 or null
        h: item.h || 2, // Default to 2 if 0 or null
        minW: 1,
        minH: 1,
        isDraggable: isEditable,
        isResizable: isEditable && item.type !== 'section-title',
    }));

    // Server Action Integration
    const handleLayoutChange = async (currentLayout: any[]) => {
        if (!isEditable) return;
        const { updateModulePosition } = await import("@/actions/modules");
        currentLayout.forEach(l => {
            updateModulePosition(l.i, l.x, l.y, l.w, l.h);
        });
    };

    if (!ResponsiveGridLayout) {
        return <div className="p-4 text-red-500">Error: Grid layout library could not be loaded. Please check console for export details.</div>;
    }

    return (
        <div ref={containerRef} className="w-full">
            {/* @ts-ignore */}
            <ResponsiveGridLayout
                className="layout"
                layouts={{ lg: layout, md: layout, sm: layout, xs: layout, xxs: layout }}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={cols}
                rowHeight={rowHeight}
                width={width}
                onLayoutChange={handleLayoutChange}
                isDraggable={isEditable}
                isResizable={isEditable}
                margin={[16, 16]}
                wrapperStyle={{ height: 'auto' }}
                resizeHandles={['se', 's', 'e']}
            >
                {sortedItems.map((item, index) => (
                    <div key={item.id}>
                        <div
                            className="relative group z-10 hover:z-50 h-full animate-blur-in opacity-0"
                            style={{ animationDelay: `${(index * 100) + 300}ms`, animationFillMode: 'forwards' }}
                        >
                            <GridItem className="h-full" transparent={item.type === 'section-title'} radius={theme?.radius}>
                                {isEditable && (
                                    <div className="absolute top-2 right-2 z-50 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onClick={async (e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (confirm("Delete this module?")) {
                                                    await deleteModule(item.id);
                                                    router.refresh();
                                                }
                                            }}
                                            className="p-2 bg-secondary/80 hover:bg-destructive/20 hover:text-destructive rounded-full shadow-sm backdrop-blur-sm cursor-pointer text-muted-foreground transition-colors"
                                            title="Delete Module"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setEditingModule(item);
                                            }}
                                            className="p-2 bg-secondary/80 hover:bg-secondary rounded-full shadow-sm backdrop-blur-sm cursor-pointer text-foreground transition-colors"
                                            title="Edit Module"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                <ModuleRenderer item={item} isEditable={isEditable} />
                            </GridItem>
                            {isEditable && item.type !== 'section-title' && <ModuleResizeToolbar module={item} />}
                        </div>
                    </div>
                ))}
            </ResponsiveGridLayout>

            {editingModule && (
                <EditModuleDialog
                    module={editingModule}
                    open={!!editingModule}
                    onOpenChange={(open) => !open && setEditingModule(null)}
                />
            )}
        </div>
    );
}
