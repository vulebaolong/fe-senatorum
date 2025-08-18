"use client";

import { SelectContent, SelectItem } from "@/components/ui/select";
import { TType } from "@/types/type.type";

type TProps = {
    listTypeArticle: TType[] | null
};

export default function TypeSelect({ listTypeArticle }: TProps) {
    return (
        <SelectContent align="start">
            {listTypeArticle?.map((item) => (
                <SelectItem key={item.id} value={item.id.toString()}>
                    {item.name}
                </SelectItem>
            ))}
        </SelectContent>
    );
}
