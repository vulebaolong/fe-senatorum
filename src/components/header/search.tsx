"use client";

import { CommandSeparator } from "cmdk";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";

export default function Search() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                variant="secondary"
                className="h-full md:w-40 lg:w-60 xl:w-72 flex items-center justify-between gap-2 rounded-full px-4 dark:bg-muted bg-zinc-100 order-sidebar-border border relative w-full"
            >
                <span className="hidden lg:inline-flex text-xs text-muted-foreground opacity-50">Search Article</span>
                <span className="inline-flex lg:hidden text-xs text-muted-foreground opacity-50">Search...</span>
                <kbd className="bg-background text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        <CommandItem>Calendar</CommandItem>
                        <CommandItem>Search Emoji</CommandItem>
                        <CommandItem>Calculator</CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Settings">
                        <CommandItem>Profile</CommandItem>
                        <CommandItem>Billing</CommandItem>
                        <CommandItem>Settings</CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
