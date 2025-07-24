import { Button } from "@/components/ui/button";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TCategory } from "@/types/category.type";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

type Props = {
    value: TCategory[];
    onChange: (value: TCategory[]) => void;
    options: TCategory[];
};

export function CategoryMultiSelect({ value, onChange, options }: Props) {
    const [open, setOpen] = useState(false);

    const toggleItem = (item: TCategory) => {
        const exists = value.find((v) => v.id === item.id);
        if (exists) {
            onChange(value.filter((v) => v.id !== item.id));
        } else {
            if (value.length >= 3) return;
            onChange([...value, item]);
        }
    };

    const isSelected = (item: TCategory) => value.some((v) => v.id === item.id);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="min-w-[180px] w-max justify-between text-muted-foreground hover:text-muted-foreground">
                    {value.length > 0 ? value.map((v) => v.name).join(", ") : "Select up to 3 categories"}
                    <ChevronDown className="size-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Tìm danh mục..." />
                    <CommandList>
                        {options.map((item) => (
                            <CommandItem key={item.id} onSelect={() => toggleItem(item)} className="flex justify-between">
                                <span>{item.name}</span>
                                {isSelected(item) && <Check className="h-4 w-4" />}
                            </CommandItem>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
