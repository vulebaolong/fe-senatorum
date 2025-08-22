"use client";

import { useGetAllArticle } from "@/api/tantask/article.tanstack";
import { AppendLoading } from "@/components/data-state/append-state/AppendState";
import NodataOverlay from "@/components/no-data/NodataOverlay";
import { Skeleton } from "@/components/ui/skeleton";
import { useFillSkeletons } from "@/hooks/fill-skeleton-article";
import { TArticle } from "@/types/article.type";
import { useEffect, useRef, useState } from "react";
import ArticleItem from "../article-item/article-item";

type TProps = {
    filters?: Record<string, any>;
    id?: string;
    // type: "all" | "my" | "other";
    // className?: string;
};

export default function ArticleSelf({ filters, id }: TProps) {
    const [page, setPage] = useState(1);
    const [articles, setArticles] = useState<TArticle[]>([]);
    const pageSize = 10;
    const totalPageRef = useRef(0);
    const containerRef = useRef(null);
    const bottomTriggerRef = useRef(null);

    const getAllArticle = useGetAllArticle({
        pagination: { pageIndex: page, pageSize },
        filters,
        id: id,
        sort: { sortBy: `createdAt`, isDesc: true },
    });

    useEffect(() => {
        if (!getAllArticle.data?.items) return;

        const newArticles = getAllArticle.data.items;
        setArticles((prev) => {
            if (page === 1) return newArticles;
            return [...prev, ...newArticles];
        });
    }, [getAllArticle.data?.items]);

    useEffect(() => {
        if (getAllArticle.data?.totalPage) totalPageRef.current = getAllArticle.data.totalPage;
    }, [getAllArticle.data?.totalPage]);

    const itemWidth = 300;
    const gap = 20;
    const skeletonCount = useFillSkeletons(containerRef, itemWidth, articles.length, gap);

    const handleEndReached = () => {
        if (getAllArticle.isFetching || getAllArticle.isLoading || page >= totalPageRef.current) return;
        setPage((prev) => prev + 1);
    };

    return (
        <div ref={containerRef} className={`p-5 h-[calc(100vh-var(--header-height))] overflow-y-scroll`}>
            <div
                className={`relative grid gap-5 justify-center [grid-template-columns:repeat(auto-fill,minmax(${itemWidth}px,${itemWidth}px))] min-h-full`}
            >
                <AppendLoading
                    isLoading={getAllArticle.isLoading}
                    isEmpty={articles.length === 0}
                    isError={getAllArticle.isError}
                    onBottom={handleEndReached}
                    containerRef={containerRef}
                    footerLoadingComponent={Array.from({ length: skeletonCount }).map((_, i) => (
                        <Skeleton key={i} className="min-h-[430px] h-full w-full rounded-xl" />
                    ))}
                    initialLoadingComponent={Array.from({ length: skeletonCount }).map((_, i) => (
                        <Skeleton key={i} className="h-[430px] w-full rounded-xl" />
                    ))}
                    noDataComponent={<NodataOverlay visible />}
                >
                    {articles.map((article) => (
                        <ArticleItem key={article.id} article={article} />
                    ))}
                </AppendLoading>
            </div>
            <div ref={bottomTriggerRef} className="w-full h-1"></div>
        </div>
    );
}
