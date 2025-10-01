"use client";

import { useGetAllArticle, useGetMyArticle, useGetMyBookmarkedArticle, useGetMyUpvotedArticle } from "@/api/tantask/article.tanstack";
import { useFillSkeletons } from "@/hooks/fill-skeleton-article";
import { cn } from "@/lib/utils";
import { TArticle } from "@/types/article.type";
import { EArticleVariant } from "@/types/enum/article.enum";
import { useEffect, useRef, useState } from "react";
import { AppendLoading } from "../../data-state/append-state/AppendState";
import NodataOverlay from "../../no-data/NodataOverlay";
import { Skeleton } from "../../ui/skeleton";
import ArticleItem from "../article-item/article-item";

type TProps = {
    filters?: Record<string, any>;
    id?: string;
    type: "all" | "my" | "upvoted" | "bookmarked";
    // className?: string;
};

export default function Articlelist({ filters, id, type }: TProps) {
    const [page, setPage] = useState(1);
    const [articles, setArticles] = useState<TArticle[]>([]);

    const totalPageRef = useRef(0);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const pageSize = 8;
    const itemWidth = 300;
    const gap = 20;
    const skeletonCount = useFillSkeletons(containerRef, itemWidth, articles.length, gap);

    const getAllArticle = (() => {
        if (type === "all") return useGetAllArticle;
        if (type === "upvoted") return useGetMyUpvotedArticle;
        if (type === "bookmarked") return useGetMyBookmarkedArticle;
        return useGetMyArticle;
        // return useGetOtherArticle;
    })()({
        pagination: { page: page, pageSize },
        filters: filters || {},
        sort: { sortBy: `createdAt`, isDesc: true },
    });

    // const getAllArticleBookmark = useGetAllArticleBookmark()

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

    const handleEndReached = () => {
        if (getAllArticle.isFetching || getAllArticle.isLoading || page >= totalPageRef.current) return;
        setPage((prev) => prev + 1);
    };

    return (
        <div ref={containerRef} className={`relative p-5 gap-5 h-[calc(100dvh-var(--header-height))] overflow-y-scroll`}>
            <div
                className={cn(
                    "relative grid gap-5 justify-center",
                    "[grid-template-rows:max-content]",
                    `[grid-template-columns:repeat(auto-fill,minmax(${itemWidth}px,${itemWidth}px))] min-h-[calc(100%-4px)]`,
                    "min-h-0"
                )}
            >
                <AppendLoading
                    isLoading={getAllArticle.isLoading}
                    isEmpty={articles.length === 0}
                    isError={getAllArticle.isError}
                    onLoadMore={handleEndReached}
                    containerRef={containerRef}
                    footerLoadingComponent={Array.from({ length: skeletonCount }).map((_, i) => (
                        <Skeleton key={i} className={cn(`h-full w-full rounded-xl`)} />
                    ))}
                    initialLoadingComponent={Array.from({ length: skeletonCount }).map((_, i) => (
                        <Skeleton key={i} className={cn(`h-full w-full rounded-xl`)} />
                    ))}
                    noDataComponent={<NodataOverlay visible />}
                >
                    {articles.map((article) => {
                        if (article.variant === EArticleVariant.POST) {
                            // return <PostItem key={article.id} article={article} />;
                        }
                        if (article.variant === EArticleVariant.ARTICLE) {
                            return <ArticleItem key={article.id} article={article} />;
                        }
                    })}
                </AppendLoading>
            </div>
        </div>
    );
}
