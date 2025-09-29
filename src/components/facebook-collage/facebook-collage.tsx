"use client";

import Image from "next/image";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY } from "@/constant/app.constant";

export type CollageItem = {
    id: string;
    localBlobUrl: string | null;
    serverUrl: string | null;
    uploading: boolean;
};

type FacebookCollageSmartProperties = {
    items: CollageItem[];
    className?: string;
    roundedClassName?: string; // ví dụ "rounded-xl"
    onImageClick?: (index: number) => void;
};

export default function FacebookCollage({ items, className, roundedClassName = "rounded-xl", onImageClick }: FacebookCollageSmartProperties) {
    const totalCount = items.length;
    const firstFive = items.slice(0, 6);
    const extraCount = totalCount > 6 ? totalCount - 6 : 0;

    const gridClassByCount: Record<number, string> = {
        1: "grid grid-cols-1 grid-rows-1",
        2: "grid grid-cols-2 gap-1",
        3: "grid grid-cols-2 grid-rows-2 gap-1",
        4: "grid grid-cols-2 grid-rows-2 gap-1",
        5: "grid grid-cols-3 grid-rows-2 gap-1",
        6: "grid grid-cols-3 grid-rows-2 gap-1",
    };
    const gridClassName = gridClassByCount[Math.min(totalCount, 6)] || gridClassByCount[6];

    return (
        <div className={cn(gridClassName, className)}>
            {firstFive.map((item, index) => {
                const displayImageUrl =( item.serverUrl && `${NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY}/${item.serverUrl}`) || item.localBlobUrl || "";
                let cellClassName = "relative w-full h-full";
                const baseCellClassName = cn("relative w-full h-full overflow-hidden", roundedClassName);

                if (totalCount === 1) {
                    cellClassName = cn(baseCellClassName, "aspect-[4/3] sm:aspect-[3/2]");
                } else if (totalCount === 2) {
                    cellClassName = cn(baseCellClassName, "aspect-square");
                } else if (totalCount === 3) {
                    cellClassName =
                        index === 0 ? cn(baseCellClassName, "row-span-2 aspect-[2/3] sm:aspect-auto") : cn(baseCellClassName, "aspect-square");
                } else if (totalCount === 4) {
                    cellClassName = cn(baseCellClassName, "aspect-square");
                } else {
                    cellClassName =
                        index === 0
                            ? cn(baseCellClassName, "col-span-2 row-span-2 aspect-[4/5] sm:aspect-auto")
                            : cn(baseCellClassName, "aspect-square");
                }

                const showExtraOverlay = extraCount > 0 && index === 5;

                return (
                    <button key={item.id} type="button" onClick={() => onImageClick?.(index)} className={cn(cellClassName, "group")}>
                        {!!displayImageUrl && (
                            <Image
                                src={displayImageUrl}
                                alt={`media-${index}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority={index === 0}
                            />
                        )}

                        {/* Overlay đang upload */}
                        {item.uploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Loader2 className="h-5 w-5 animate-spin text-white" />
                            </div>
                        )}

                        {/* Overlay +N nếu > 5 ảnh */}
                        {showExtraOverlay && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="text-white text-xl font-semibold">+{extraCount}</span>
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
