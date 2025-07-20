"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonArticle({ length = 5 }: { length?: number }) {
    return (
        <div className="grid gap-5 justify-center [grid-template-columns:repeat(auto-fill,minmax(300px,300px))]">
            {Array.from({ length: length }).map((_, i) => (
                <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
            ))}
        </div>
    );
}
