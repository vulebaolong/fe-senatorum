"use client";

import { Button } from "@/components/ui/button";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TCategory } from "@/types/category.type";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

type Props = {
    value: string[];
    onChange: (value: string[]) => void;
    listCategoryArticle: TCategory[] | null;
};

export function CategoryMultiSelect({ value, onChange, listCategoryArticle }: Props) {
    const [open, setOpen] = useState(false);

    const toggleItem = (itemId: string) => {
        if (value.includes(itemId)) {
            onChange(value.filter((id) => id !== itemId));
        } else {
            if (value.length >= 3) return;
            onChange([...value, itemId]);
        }
    };

    const isSelected = (itemId: string) => value.includes(itemId);

    const selectedNames = (listCategoryArticle ?? [])
        .filter((c) => value.includes(c.id))
        .map((c) => c.name)
        .join(", ");

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between font-normal">
                    {value.length > 0 ? selectedNames : <p className="text-muted-foreground">Select up to 3 categories</p>}
                    <ChevronDown className="size-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Tìm danh mục..." />
                    <CommandList className="relative min-h-10">
                        {listCategoryArticle?.map((item) => (
                            <CommandItem key={item.id} onSelect={() => toggleItem(item.id)} className="flex justify-between">
                                <span>{item.name}</span>
                                {isSelected(item.id) && <Check className="h-4 w-4" />}
                            </CommandItem>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
