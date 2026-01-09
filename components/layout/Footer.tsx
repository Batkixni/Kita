import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full py-12 px-6 border-t border-border/40 bg-background/50 backdrop-blur-sm mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-6">

                {/* Links */}
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-medium text-muted-foreground">
                    {/* Minimal Footer Links */}
                    <Link href="#" className="hover:text-foreground transition-colors">Twitter</Link>
                    <Link href="#" className="hover:text-foreground transition-colors">GitHub</Link>
                </div>

                {/* Subtext */}
                <p className="text-xs text-muted-foreground/50 text-center max-w-lg leading-relaxed">
                    All scopes are the modified trademark of their respective owners. <br />
                    Kita is not affiliated with any of the services displayed.
                </p>

                {/* Badge */}
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border/50">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-bold text-foreground tracking-wider uppercase">Kita Inc</span>
                </div>

            </div>
        </footer>
    );
}
