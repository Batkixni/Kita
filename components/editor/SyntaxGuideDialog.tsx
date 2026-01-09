'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function SyntaxGuideDialog({ themeConfig }: { themeConfig?: any }) {
    // Theme logic derived from themeConfig
    const themeClass = themeConfig?.cssClass || "";
    // Re-derive darkness logic or just trust simple class inheritance if setup right, but Portal needs explicit class.
    const isDark = (color?: string) => {
        if (!color) return false;
        try {
            const hex = color.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return (r * 0.299 + g * 0.587 + b * 0.114) < 186;
        } catch (e) { return false; }
    };
    const bgColor = themeConfig?.backgroundColor;
    let isDarkMode = false;
    if (themeClass && themeClass.trim() !== '') {
        isDarkMode = themeClass.includes('dark');
    } else {
        isDarkMode = !bgColor || isDark(bgColor);
    }

    const previewCssClass = cn(
        themeClass,
        isDarkMode ? "dark" : ""
    );

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 text-stone-600">
                    <Code className="w-4 h-4" />
                    Syntax Guide
                </Button>
            </DialogTrigger>
            <DialogContent className={cn("max-w-2xl max-h-[80vh] overflow-y-auto", previewCssClass)}>
                <DialogHeader>
                    <DialogTitle>Custom Module Syntax Guide</DialogTitle>
                    <DialogDescription>
                        You can use standard Markdown and HTML with Tailwind CSS classes.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="basics" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="basics">Basics</TabsTrigger>
                        <TabsTrigger value="components">Components</TabsTrigger>
                        <TabsTrigger value="layout">Layout</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basics" className="space-y-4 py-4">
                        <Section title="Markdown">
                            <CodeBlock label="Headings" code={`# Heading 1
## Heading 2
### Heading 3`} />
                            <CodeBlock label="Formatting" code={`**Bold**
*Italic*
[Link](https://example.com)`} />
                        </Section>
                        <Section title="Tailwind Text">
                            <CodeBlock label="Colors & Size" code={`<span class="text-blue-500 font-bold">Blue Bold Text</span>
<p class="text-xs text-stone-400">Tiny gray text</p>`} />
                        </Section>
                    </TabsContent>

                    <TabsContent value="components" className="space-y-4 py-4">
                        <Section title="Badges">
                            <Preview>
                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">Beta</span>
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs ml-2">Active</span>
                            </Preview>
                            <CodeBlock code={`<span class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">Beta</span>`} />
                        </Section>

                        <Section title="Buttons">
                            <Preview>
                                <button className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-stone-800 transition">Click Me</button>
                            </Preview>
                            <CodeBlock code={`<a href="https://google.com" target="_blank" class="inline-block bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-stone-800 transition no-underline">
  Button Link
</a>`} />
                        </Section>
                    </TabsContent>

                    <TabsContent value="layout" className="space-y-4 py-4">
                        <Section title="Flexbox Row">
                            <Preview>
                                <div className="flex items-center gap-2 p-2 border rounded-lg">
                                    <div className="w-8 h-8 bg-stone-200 rounded-full"></div>
                                    <div className="flex-1">
                                        <div className="h-2 w-20 bg-stone-200 rounded"></div>
                                    </div>
                                </div>
                            </Preview>
                            <CodeBlock code={`<div class="flex items-center gap-2 p-2 border border-stone-200 rounded-lg">
  <div class="w-8 h-8 bg-stone-200 rounded-full"></div>
  <div class="flex-1">
    <p class="font-bold text-sm">User Name</p>
    <p class="text-xs text-stone-500">Description</p>
  </div>
</div>`} />
                        </Section>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground/80">{title}</h3>
            {children}
        </div>
    );
}

function Preview({ children }: { children: React.ReactNode }) {
    return (
        <div className="p-4 border border-border rounded-lg bg-secondary/50">
            {children}
        </div>
    );
}

function CodeBlock({ label, code }: { label?: string, code: string }) {
    const [copied, setCopied] = useState(false);

    const copy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full min-w-0 max-w-full group">
            {label && <div className="text-xs text-muted-foreground mb-1">{label}</div>}
            <div className="relative rounded-lg border border-stone-800 bg-stone-950 dark:bg-stone-900 overflow-hidden">
                <div className="overflow-x-auto">
                    <pre className="p-3 text-xs text-stone-100 font-mono whitespace-pre w-full">
                        {code}
                    </pre>
                </div>
                <button
                    onClick={copy}
                    className="absolute top-2 right-2 p-1.5 bg-white/10 hover:bg-white/20 rounded text-white opacity-0 group-hover:opacity-100 transition backdrop-blur-sm"
                    title="Copy code"
                >
                    {copied ? <span className="text-[10px]">Copied!</span> : <Copy className="w-3 h-3" />}
                </button>
            </div>
        </div>
    );
}
