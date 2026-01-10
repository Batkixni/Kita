'use client';

import { useState } from "react";
import { DraggableGrid } from "@/components/grid/DraggableGrid";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { LandingThemeSwitcher } from "@/components/landing/LandingThemeSwitcher";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Initial Demo Data
const INITIAL_MODULES = [
    {
        id: "intro-text",
        type: "text",
        content: { text: "# Welcome to Kita Demo!\n\nThis is a fully interactive demo running entirely in your browser.\n\nEverything you see here is temporary and will reset when you refresh." },
        x: 0, y: 0, w: 4, h: 4
    },
    {
        id: "demo-link",
        type: "link",
        content: { url: "https://kita.zone", customTitle: "Visit Kita", customDesc: "The best place to build your personal page." },
        x: 4, y: 0, w: 2, h: 2
    },
    {
        id: "demo-image",
        type: "image",
        content: { src: "https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=1000&auto=format&fit=crop" },
        x: 4, y: 2, w: 2, h: 2
    },
    {
        id: "demo-project",
        type: "custom",
        content: { text: "{{project title=\"My Awesome Project\" desc=\"Built with Next.js and Tailwind\" link=\"github.com\"}}" },
        x: 0, y: 4, w: 4, h: 2
    }
];

export default function DemoPage() {
    const [modules, setModules] = useState<any[]>(INITIAL_MODULES);
    const [theme, setTheme] = useState("default");

    // Handlers for Grid Updates (Client-Side Only)

    const handleAddModule = (type: string, content: any, w: number, h: number) => {
        const newModule = {
            id: crypto.randomUUID(),
            type,
            content,
            x: 0, // Grid will auto-place usually, or we default to 0,0
            y: Infinity, // Put at bottom
            w,
            h
        };
        setModules(prev => [...prev, newModule]);
    };

    const handleLayoutChange = (layout: any[]) => {
        setModules(prev => {
            const updated = prev.map(m => {
                const l = layout.find((l: any) => l.i === m.id);
                if (l) {
                    return { ...m, x: l.x, y: l.y, w: l.w, h: l.h };
                }
                return m;
            });
            return updated;
        });
    };

    const handleUpdateContent = async (id: string, content: any) => {
        setModules(prev => prev.map(m => m.id === id ? { ...m, content } : m));
    };

    const handleDelete = async (id: string) => {
        setModules(prev => prev.filter(m => m.id !== id));
    };

    // Construct a theme config object based on the string
    const themeConfig = {
        name: theme,
        cssClass: `theme-${theme}`,
        backgroundColor: "", // Rely on CSS class
        radius: "0.5rem"
    };

    return (
        <div className={cn("min-h-screen bg-background text-foreground transition-colors duration-500", themeConfig.cssClass)}>

            {/* Top Bar */}
            <div className="fixed top-0 left-0 w-full z-50 p-4 flex justify-between items-center pointer-events-none">
                <div className="pointer-events-auto">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="gap-2 rounded-full bg-background/50 backdrop-blur-md border border-border/50 shadow-sm hover:bg-background/80">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Button>
                    </Link>
                </div>

                <div className="pointer-events-auto flex gap-2">
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-primary/20">
                        Demo Mode
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="min-h-screen p-4 pt-20 pb-32 container mx-auto max-w-[1400px]">

                {/* Fake Profile Header for completeness */}
                <div className="mb-8 p-6 bg-secondary/30 rounded-3xl border border-border/50 text-center relative group">
                    <div className="w-24 h-24 mx-auto bg-primary text-primary-foreground rounded-full flex items-center justify-center text-4xl font-bold mb-4 shadow-xl">
                        D
                    </div>
                    <h1 className="text-3xl font-black tracking-tight mb-2">Demo User</h1>
                    <p className="text-muted-foreground max-w-md mx-auto">This is a client-side demo. Feel free to mess around! Changes are not saved to the server.</p>

                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <LandingThemeSwitcher />
                    </div>
                </div>

                <DraggableGrid
                    items={modules}
                    isEditable={true}
                    onLayoutChange={handleLayoutChange}
                    onUpdateContent={handleUpdateContent}
                    onDelete={handleDelete}
                    theme={themeConfig}
                />
            </main>

            {/* Toolbar */}
            <EditorToolbar
                pageId="demo-page" // Dummy ID
                themeConfig={themeConfig}
                onAdd={handleAddModule}
            />

            {/* Theme Injector for Demo */}
            <ThemeInjector theme={theme} />
        </div>
    );
}

// Helper to inject theme CSS (similar to ThemeProvider but simple for demo)
function ThemeInjector({ theme }: { theme: string }) {
    // In a real app this is handled by layout/provider.
    // Here we just ensure the class is on the body or wrapper.
    // Actually the wrapper div handles it.
    // But we might need global styles if they are attached to :root or body.
    // Our themes usually attach variables to .theme-name class.
    return null;
}
