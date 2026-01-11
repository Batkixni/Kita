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
import { SpotifyPlaylistModule } from "../modules/more/SpotifyPlaylistModule";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";


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
    // Actions are now passed in to support both Server (Real) and Demo (Local) modes
    onLayoutChange: (layout: any[]) => void;
    onDelete?: (id: string) => Promise<void>;
    onUpdateContent?: (id: string, content: any) => Promise<void>;
    theme?: any;
}

const ModuleRenderer = ({ item, isEditable, theme }: { item: any, isEditable: boolean, theme: any }) => {
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
                    theme={theme}
                />
            );
        case 'image':
            return <ImageModule src={item.content?.src} alt={item.content?.alt} />;
        case 'text':
            return <TextModule text={item.content?.text} />;
        case 'portfolio':
            return <PortfolioModule content={item.content?.text} w={item.w} h={item.h} />;
        case 'section-title':
            return <SectionTitleModule title={item.content?.text} />;
        case 'custom':
            return <CustomModule content={item.content?.text} isEditable={isEditable} w={item.w} h={item.h} />;
        case 'spotify-playlist':
            return <SpotifyPlaylistModule url={item.content?.url} w={item.w} h={item.h} theme={theme} isEditable={isEditable} />;
        default:
            return <div className="p-4 rounded-xl bg-red-50 text-red-500">Unknown module</div>;
    }
};

export function DraggableGrid({ items, isEditable = false, onLayoutChange, onDelete, onUpdateContent, theme }: DraggableGridProps) {
    const [editingModule, setEditingModule] = useState<any>(null);
    const [deleteModuleId, setDeleteModuleId] = useState<string | null>(null);
    const [width, setWidth] = useState(1200);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // ... (keep grid config logic: cols, getCols, rowHeight, etc.) ...
    // Note: Since I'm essentially replacing the whole component logic block, I need to be careful to include the existing grid logic code or rely on 'unchanged'.
    // The replace block covers the whole function body basically.

    // Grid Configuration
    const cols = { lg: 8, md: 8, sm: 8, xs: 4, xxs: 2 };
    const getCols = (w: number) => {
        if (w >= 1200) return cols.lg;
        if (w >= 996) return cols.md;
        if (w >= 768) return cols.sm;
        if (w >= 480) return cols.xs;
        return cols.xxs;
    };

    const currentCols = getCols(width);
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

    // Sort items
    const sortedItems = [...items].sort((a, b) => {
        if (a.y !== b.y) return a.y - b.y;
        return a.x - b.x;
    });

    // Determine if we are in mobile mode (xs or xxs)
    const isMobile = width < 768; // sm breakpoint
    const prevIsMobileRef = useRef(isMobile);

    useEffect(() => {
        prevIsMobileRef.current = isMobile;
    }, [isMobile]);

    // Calculate layout based on current mode
    const layout = sortedItems.map(item => {
        // Check if item has SPECIFIC mobile layout saved
        const hasMobileLayout = item.mobileX !== null && item.mobileX !== undefined;
        const useMobile = isMobile && hasMobileLayout;

        if (useMobile) {
            return {
                i: item.id,
                x: item.mobileX,
                y: item.mobileY,
                w: item.mobileW || item.w || 2,
                h: item.mobileH || item.h || 2,
                minW: 1,
                minH: 1,
                isDraggable: isEditable,
                isResizable: isEditable && item.type !== 'section-title',
            };
        } else if (isMobile && !hasMobileLayout) {
            // Generating DEFAULT mobile layout from Desktop
            // Desktop cols: 8 (usually). Mobile cols: 2 (xxs) or 4 (xs).
            // We want to scale down dimensions to preserve shape/ratio roughly, 
            // but ensuring they fit in mobile view without being 1000px tall.

            // Assume desktop W/H was designed for ~8 cols.
            // Mobile is ~2 cols. Scaling factor ~ 0.25 (or 0.5 for tablet).
            // But usually we just want full width (w=2) or half width (w=1) on mobile.

            // Heuristic:
            // If desktop W >= 4 (half screen), mobile W = 2 (full screen on xxs).
            // If desktop W < 4, mobile W = 1 (half screen on xxs).
            // H should be scaled similarly to avoid elongation.

            // Current Desktop W / 4 approx = Mobile W (for 2-col).
            // But let's simplify.

            let defaultMobileW = item.w >= 4 ? 2 : 2; // Default to full width on mobile (2 cols) mostly, unless tiny?
            if (item.w <= 2) defaultMobileW = 1; // 1/2 screen

            // Scale H to match aspect ratio change?
            // Desktop: W=4, H=4 (Square). 
            // Mobile: W=2. If H=4 -> Tall rectangle.
            // Mobile Grid Cell is larger than Desktop Grid Cell?
            // Desktop (1200px / 8) = 150px.
            // Mobile (400px / 2) = 200px.
            // Cells are roughly similar size (1.33x).
            // So if Desktop H=4 (600px), Mobile H=4 (800px). 
            // We should keep H roughly same or slightly smaller.

            let defaultMobileH = item.h;

            // However, if we forced Width to shrink (e.g. 8 -> 2), keeping H=8 means it becomes super tall narrow strip?
            // No, W=8 (Full) -> W=2 (Full). Visual width is same (100%).
            // Use original H.

            // But the user screenshot shows HUGE height.
            // Maybe they set H to something large on desktop?
            // Or maybe my previous `item.mobileH || item.h` was actually picking up a `null` and defaulting to `2`? 
            // No, DB defaults: null. 
            // My code: `item.mobileH || item.h || 2`.
            // If `item.mobileH` is null, it uses `item.h`.
            // If `item.h` is large, it uses large.

            // Let's cap the height for auto-generated mobile layout.
            // Max height 4?

            defaultMobileH = Math.min(item.h, 6);

            // Also, if text module, maybe it needs height?

            return {
                i: item.id,
                x: 0, // Let RGL pack it
                y: Infinity, // Let RGL pack it
                w: defaultMobileW,
                h: defaultMobileH,
                minW: 1,
                minH: 1,
                isDraggable: isEditable,
                isResizable: isEditable && item.type !== 'section-title',
            }
        } else {
            // Desktop Mode
            return {
                i: item.id,
                x: item.x,
                y: item.y,
                w: item.w || 2,
                h: item.h || 2,
                minW: 1,
                minH: 1,
                isDraggable: isEditable,
                isResizable: isEditable && item.type !== 'section-title',
            };
        }
    });

    if (!ResponsiveGridLayout) {
        return <div className="p-4 text-red-500">Error: Grid layout library could not be loaded.</div>;
    }

    return (
        <div ref={containerRef} className="w-full">
            {/* @ts-ignore */}
            <ResponsiveGridLayout
                key={isMobile ? 'mobile-grid' : 'desktop-grid'}
                className="layout"
                layouts={{ lg: layout, md: layout, sm: layout, xs: layout, xxs: layout }}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={cols}
                rowHeight={rowHeight}
                width={width}
                onLayoutChange={(currentLayout: any[]) => {
                    // Only save if editable (owner)
                    if (isEditable) {
                        // Check for mode switch race condition
                        if (prevIsMobileRef.current !== isMobile) {
                            console.log("Ignoring layout change during mode switch");
                            return;
                        }

                        // Map the current layout back to our items structure
                        // If isMobile, the 'x' and 'y' in currentLayout are actually mobileX and mobileY
                        // We need to preserve the OTHER mode's coordinates from the original items.

                        const updatedModules = currentLayout.map(lItem => {
                            const originalItem = items.find(i => i.id === lItem.i);
                            if (!originalItem) return null;

                            // If we are in mobile mode, the grid 'x' is our 'mobileX'
                            if (isMobile) {
                                return {
                                    ...originalItem, // Keep all other props
                                    id: lItem.i,
                                    // Pass original desktop coords from original item
                                    x: originalItem.x,
                                    y: originalItem.y,
                                    w: originalItem.w,
                                    h: originalItem.h,
                                    // Update mobile coords
                                    mobileX: lItem.x,
                                    mobileY: lItem.y,
                                    mobileW: lItem.w,
                                    mobileH: lItem.h,
                                    originalX: originalItem.x, // For page handler (legacy/safety)
                                    originalY: originalItem.y,
                                    originalW: originalItem.w,
                                    originalH: originalItem.h,
                                };
                            } else {
                                // Desktop mode
                                return {
                                    ...originalItem,
                                    id: lItem.i,
                                    x: lItem.x,
                                    y: lItem.y,
                                    w: lItem.w,
                                    h: lItem.h,
                                    // Preserve mobile coords
                                    mobileX: originalItem.mobileX,
                                    mobileY: originalItem.mobileY,
                                    mobileW: originalItem.mobileW,
                                    mobileH: originalItem.mobileH
                                };
                            }
                        }).filter(Boolean);

                        // Deep compare with current items to prevent infinite loop
                        const hasChanges = updatedModules.some((newItem: any) => {
                            const oldItem = items.find(i => i.id === newItem.id);
                            if (!oldItem) return true;

                            if (isMobile) {
                                return (
                                    newItem.mobileX !== oldItem.mobileX ||
                                    newItem.mobileY !== oldItem.mobileY ||
                                    newItem.mobileW !== oldItem.mobileW ||
                                    newItem.mobileH !== oldItem.mobileH
                                );
                            } else {
                                return (
                                    newItem.x !== oldItem.x ||
                                    newItem.y !== oldItem.y ||
                                    newItem.w !== oldItem.w ||
                                    newItem.h !== oldItem.h
                                );
                            }
                        });

                        if (hasChanges) {
                            onLayoutChange(updatedModules as any[]);
                        } else {
                            // console.log("No layout changes detected, skipping update");
                        }
                    }
                }}
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
                            <GridItem className="h-full" transparent={item.type === 'section-title' || item.type === 'spotify-playlist'} radius={theme?.radius}>
                                {isEditable && (
                                    <div className="absolute top-2 right-2 z-50 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onClick={async (e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setDeleteModuleId(item.id);
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
                                <ModuleRenderer item={item} isEditable={isEditable} theme={theme} />
                            </GridItem>
                            {isEditable && item.type !== 'section-title' && <ModuleResizeToolbar module={item} onDeleteClick={() => setDeleteModuleId(item.id)} />}
                        </div>
                    </div>
                ))}
            </ResponsiveGridLayout>

            {editingModule && (
                <EditModuleDialog
                    module={editingModule}
                    open={!!editingModule}
                    onOpenChange={(open) => !open && setEditingModule(null)}
                    themeConfig={theme}
                    onSave={async (id, content) => {
                        if (onUpdateContent) await onUpdateContent(id, content);
                        router.refresh();
                    }}
                    onDelete={async (id) => {
                        if (onDelete) await onDelete(id);
                        router.refresh();
                    }}
                />
            )}

            <AlertDialog open={!!deleteModuleId} onOpenChange={(open) => !open && setDeleteModuleId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this module?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently remove the module from your page.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async (e) => {
                                e.preventDefault();
                                if (deleteModuleId && onDelete) {
                                    try {
                                        await onDelete(deleteModuleId);
                                        router.refresh();
                                    } catch (error) {
                                        console.error("Failed to delete", error);
                                    }
                                }
                                setDeleteModuleId(null);
                            }}
                            className="bg-red-600 focus:ring-red-600 text-white hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
