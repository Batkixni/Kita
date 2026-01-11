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

    const layout = sortedItems.map(item => ({
        i: item.id,
        x: item.x,
        y: item.y,
        w: item.w || 2,
        h: item.h || 2,
        minW: 1,
        minH: 1,
        isDraggable: isEditable,
        isResizable: isEditable && item.type !== 'section-title',
    }));

    if (!ResponsiveGridLayout) {
        return <div className="p-4 text-red-500">Error: Grid layout library could not be loaded.</div>;
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
                onLayoutChange={(layout: any[]) => {
                    // Prevent saving layout changes when in mobile view (compacted columns)
                    // We only want to persist the "Desktop" arrangement.
                    // Only save if editable (owner)
                    if (width >= 768 && isEditable) {
                        onLayoutChange(layout);
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
