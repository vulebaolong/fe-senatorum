"use client";

import { SelectContent, SelectItem } from "@/components/ui/select";
import { TResPagination } from "@/types/app.type";
import { TType } from "@/types/type.type";

type TProps = {
    listTypeArticle: TResPagination<TType> | null;
};

export default function TypeSelect({ listTypeArticle }: TProps) {
    return (
        <SelectContent align="start">
            {listTypeArticle?.items.map((item) => (
                <SelectItem key={item.id} value={item.id.toString()}>
                    {item.name}
                </SelectItem>
            ))}
        </SelectContent>
    );
}
