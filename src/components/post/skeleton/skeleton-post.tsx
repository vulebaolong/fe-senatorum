"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonPost({ length = 5 }: { length?: number }) {
    return (
        <div className={"mt-5 grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"}>
            {Array.from({ length: length }).map((_, i) => (
                <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
            ))}
        </div>
    );
}
