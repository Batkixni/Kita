import Link from "next/link";
import { cn } from "@/lib/utils";

export function UserFooter({ className }: { className?: string }) {
    return (
        <footer className={cn("w-full py-8 mt-auto flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity", className)}>
            <Link href="/" className="flex items-center gap-2 group">
                <div className="w-2 h-2 rounded-full bg-primary group-hover:animate-pulse" />
                <span className="text-[10px] font-bold text-foreground tracking-widest uppercase">Kita Inc</span>
            </Link>
        </footer>
    );
}
