"use client";

import ImageCustom from "@/components/custom/image-custom/ImageCustom";
import { SelectContent, SelectItem } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { TType } from "@/types/type.type";

type TProps = {
    listTypeArticle: TType[] | null;
};

export default function TypeSelect({ listTypeArticle }: TProps) {
    return (
        <SelectContent align="start">
            {listTypeArticle?.map((item) => {
                const [imageName] = item.slug.split("_");
                return (
                    <Tooltip key={item.id}>
                        <TooltipTrigger asChild>
                            <SelectItem value={item.id.toString()}>
                                <div className={cn("flex items-center gap-2")}>
                                    <div className="size-3">
                                        <ImageCustom src={`/images/article-type/${imageName}.webp`} alt={imageName} imageFor="list" />
                                    </div>
                                    {item.name}
                                </div>
                            </SelectItem>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{item.description}</p>
                        </TooltipContent>
                    </Tooltip>
                );
            })}
        </SelectContent>
    );
}
