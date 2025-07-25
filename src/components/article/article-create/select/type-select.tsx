import { useGetListTypeArticle } from "@/api/tantask/type.tanstack";
import { OverlayState } from "@/components/data-state/overlay-state/OverlayState";
import { SelectContent, SelectItem } from "@/components/ui/select";
import { TResPagination } from "@/types/app.type";
import { TType } from "@/types/type.type";
import React from "react";

export default function TypeSelect() {
    const getListTypeArticle = useGetListTypeArticle();

    return (
        <SelectContent align="start">
            <OverlayState<TResPagination<TType>>
                isLoading={getListTypeArticle.isLoading}
                data={getListTypeArticle.data}
                isError={getListTypeArticle.isError}
                noDataComponent={<p className="text-muted-foreground text-xs font-bold">No data</p>}
                content={({ items }) => {
                    return (
                        <>
                            {items.map((item) => (
                                <SelectItem key={item.id} value={item.id.toString()}>
                                    {item.name}
                                </SelectItem>
                            ))}
                        </>
                    );
                }}
            />
        </SelectContent>
    );
}
