"use client";

import { useGetDetailArticle } from "@/api/tantask/article.tanstack";
import { OverlayState } from "@/components/data-state/overlay-state/OverlayState";
import { Badge } from "@/components/ui/badge";
import React from "react";

type TProps = {
    slug: string;
};

export default function ArticleDetail({ slug }: TProps) {
    const getDetailArticle = useGetDetailArticle(slug);
    return (
        <div className={`p-5 h-[calc(100vh-var(--header-height))] overflow-y-scroll`}>
            <div className="relative min-h-full">
                <OverlayState isLoading={getDetailArticle.isLoading} isEmpty={getDetailArticle.data === null} isError={getDetailArticle.isError}>
                    <Badge variant="secondary">{getDetailArticle.data?.Types.name}</Badge>
                </OverlayState>
            </div>
        </div>
    );
}
