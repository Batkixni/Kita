export function SectionTitleModule({ title }: { title: string }) {
    if (!title) return null;

    return (
        <div className="w-full h-full flex items-end pb-2 px-1">
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 w-full truncate pl-1">
                {title}
            </h3>
        </div>
    );
}
