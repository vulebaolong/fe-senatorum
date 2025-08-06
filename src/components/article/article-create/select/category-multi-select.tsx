import { useGetListCategoryArticle } from "@/api/tantask/category.tanstack";
import { OverlayState } from "@/components/data-state/overlay-state/OverlayState";
import { Button } from "@/components/ui/button";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TCategory } from "@/types/category.type";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

type Props = {
    value: number[];
    onChange: (value: number[]) => void;
};

export function CategoryMultiSelect({ value, onChange }: Props) {
    const [open, setOpen] = useState(false);
    const getListCategoryArticle = useGetListCategoryArticle();

    const categories = getListCategoryArticle.data?.items ?? [];

    const toggleItem = (itemId: number) => {
        if (value.includes(itemId)) {
            onChange(value.filter((id) => id !== itemId));
        } else {
            if (value.length >= 3) return;
            console.log({ value, itemId });
            onChange([...value, itemId]);
        }
    };

    const isSelected = (itemId: number) => value.includes(itemId);

    const selectedNames = categories
        .filter((c) => value.includes(c.id))
        .map((c) => c.name)
        .join(", ");

    return (
        <Popover open={open} onOpenChange={setOpen} >
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between text-muted-foreground hover:text-muted-foreground">
                    {value.length > 0 ? selectedNames : "Select up to 3 categories"}
                    <ChevronDown className="size-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Tìm danh mục..." />
                    <CommandList className="relative min-h-10">
                        <OverlayState<TCategory[]>
                            isLoading={getListCategoryArticle.isLoading}
                            data={categories}
                            isError={getListCategoryArticle.isError}
                            noDataComponent={<p className="text-muted-foreground text-xs font-bold">No data</p>}
                            content={(items) => (
                                <>
                                    {items.map((item) => (
                                        <CommandItem key={item.id} onSelect={() => toggleItem(item.id)} className="flex justify-between">
                                            <span>{item.name}</span>
                                            {isSelected(item.id) && <Check className="h-4 w-4" />}
                                        </CommandItem>
                                    ))}
                                </>
                            )}
                        />
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
