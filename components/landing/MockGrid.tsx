'use client';

import { GridItem } from "@/components/grid/GridItem";
import { cn } from "@/lib/utils";
import { Github, Twitter, Youtube, ArrowUpRight, BarChart3, Globe } from "lucide-react";

export function MockGrid() {
    return (
        <div className="w-full max-w-2xl mx-auto p-4 relative">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 auto-rows-[100px] sm:auto-rows-[120px]">

                {/* Profile Card - Large (2x2) */}
                <div className="col-span-2 row-span-2 animate-blur-in opacity-0" style={{ animationDelay: '100ms' }}>
                    <GridItem className="p-6 flex flex-col justify-between bg-card text-card-foreground border-border relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="space-y-4 z-10">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                                K
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Kita User</h3>
                                <p className="text-muted-foreground text-sm">Design Engineer & Creator</p>
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <span className="px-2 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">UI/UX</span>
                            <span className="px-2 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">React</span>
                        </div>
                        {/* Decorative background blob */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                    </GridItem>
                </div>

                <div className="col-span-1 row-span-1 animate-blur-in opacity-0" style={{ animationDelay: '200ms' }}>
                    <GridItem className="flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 border-transparent">
                        <Twitter className="w-8 h-8" />
                    </GridItem>
                </div>

                <div className="col-span-1 row-span-1 animate-blur-in opacity-0" style={{ animationDelay: '300ms' }}>
                    <GridItem className="flex items-center justify-center bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent">
                        <Github className="w-8 h-8" />
                    </GridItem>
                </div>

                {/* Metric Card - 2x1 */}
                <div className="col-span-2 row-span-1 animate-blur-in opacity-0" style={{ animationDelay: '400ms' }}>
                    <GridItem className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Monthly Views</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black">12.5k</span>
                                <span className="text-xs text-green-500 font-bold">↑ 14%</span>
                            </div>
                        </div>
                        <div className="h-8 w-16 bg-primary/10 rounded-md flex items-center justify-center">
                            <BarChart3 className="w-4 h-4 text-primary" />
                        </div>
                    </GridItem>
                </div>

                {/* Project Link - 2x1 */}
                <div className="col-span-2 row-span-1 animate-blur-in opacity-0" style={{ animationDelay: '500ms' }}>
                    <GridItem className="p-3 flex items-center justify-between group cursor-pointer hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-chart-4/20 text-chart-4 flex items-center justify-center">
                                <span className="text-xl">🍊</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">Citrus OS</h4>
                                <p className="text-xs text-muted-foreground">Productivity System</p>
                            </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </GridItem>
                </div>

                {/*  Map/Location - 1x1 */}
                <div className="col-span-1 row-span-1 animate-blur-in opacity-0" style={{ animationDelay: '600ms' }}>
                    <GridItem className="relative p-0 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center bg-chart-3/10">
                            <Globe className="w-8 h-8 text-chart-3" />
                        </div>
                        <div className="absolute bottom-2 left-2 bg-background/80 text-foreground backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold">
                            Taipei
                        </div>
                    </GridItem>
                </div>

                {/*  Youtube - 1x1 */}
                <div className="col-span-1 row-span-1 animate-blur-in opacity-0" style={{ animationDelay: '700ms' }}>
                    <GridItem className="flex items-center justify-center bg-red-600 text-white border-transparent hover:bg-red-700">
                        <Youtube className="w-8 h-8" />
                    </GridItem>
                </div>
            </div>
        </div>
    );
}
