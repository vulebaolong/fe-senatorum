"use client";

import { useGetAllArticle, useGetMyArticle, useGetMyBookmarkedArticle, useGetMyUpvotedArticle } from "@/api/tantask/article.tanstack";
import PostItem from "@/components/post/post-item";
import { cn } from "@/lib/utils";
import { TArticle } from "@/types/article.type";
import { EArticleVariant } from "@/types/enum/article.enum";
import { MasonryInfiniteGrid } from "@egjs/react-infinitegrid";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import NodataOverlay from "../../no-data/NodataOverlay";
import { Skeleton } from "../../ui/skeleton";
import ArticleItem from "../article-item/article-item";

type ArticleWithGroup = TArticle & { __groupKey: number };

type TProps = {
    filters?: Record<string, any>;
    id?: string;
    type: "all" | "my" | "upvoted" | "bookmarked";
};

export default function Articlelist({ filters, id, type }: TProps) {
    const [page, setPage] = useState(1);
    const [articles, setArticles] = useState<ArticleWithGroup[]>([]);

    const totalPageRef = useRef(0);
    const lastAppliedFilterRef = useRef<string>("");
    const scrollerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<MasonryInfiniteGrid | null>(null);

    // Kích thước thẻ và khoảng cách cột
    const columnWidthPx = 300;
    const gapPx = 20;

    const getArticleHook = useMemo(() => {
        if (type === "all") return useGetAllArticle;
        if (type === "upvoted") return useGetMyUpvotedArticle;
        if (type === "bookmarked") return useGetMyBookmarkedArticle;
        return useGetMyArticle;
    }, [type]);

    const pageSize = 8;

    const queryPayload = {
        pagination: { pageIndex: page, pageSize },
        filters,
        id,
        sort: { sortBy: `createdAt`, isDesc: true },
    };

    const filterKey = useMemo(() => JSON.stringify({ filters, id, type }), [filters, id, type]);

    // Khi filter/type thay đổi -> reset danh sách & trang
    useEffect(() => {
        if (lastAppliedFilterRef.current !== filterKey) {
            lastAppliedFilterRef.current = filterKey;
            setPage(1);
            setArticles([]);
        }
    }, [filterKey]);

    const getAllArticle = getArticleHook(queryPayload);

    useEffect(() => {
        const received = getAllArticle.data?.items;
        if (!received) return;

        const receivedWithGroup: ArticleWithGroup[] = received.map((a) => ({
            ...a,
            __groupKey: page, // gắn group theo trang hiện tại
        }));

        setArticles((previous) => {
            if (page === 1) return receivedWithGroup;
            return [...previous, ...receivedWithGroup];
        });
    }, [getAllArticle.data?.items, page]);

    useEffect(() => {
        if (getAllArticle.data?.totalPage) {
            totalPageRef.current = getAllArticle.data.totalPage;
        }
    }, [getAllArticle.data?.totalPage]);


    const canLoadMore = !getAllArticle.isFetching && !getAllArticle.isLoading && page < totalPageRef.current;

    const handleRequestAppend = () => {
        console.log("canLoadMore", canLoadMore);
        if (canLoadMore) setPage((prev) => prev + 1);
    };

    const isEmpty = articles.length === 0 && !getAllArticle.isLoading;

    return (
        <div
            ref={scrollerRef}
            className={cn("relative h-[calc(100dvh-var(--header-height))] overflow-y-auto p-5", "min-h-0")}
            style={{ scrollbarGutter: "stable both-edges" }}
        >
            {isEmpty ? (
                <NodataOverlay visible />
            ) : (
                <MasonryInfiniteGrid
                    ref={gridRef}
                    className="relative"
                    gap={gapPx}
                    align="center"
                    scrollContainer={scrollerRef}
                    threshold={100}
                    onRequestAppend={handleRequestAppend}
                    useRecycle={false}
                    observedom="false"
                >
                    {articles.map((article) => (
                        <div key={article.id} data-grid-groupkey={article.__groupKey} style={{ width: `${columnWidthPx}px` }}>
                            {article.variant === EArticleVariant.POST ? (
                                <PostItem key={article.id} article={article} gridRef={gridRef} />
                            ) : (
                                <ArticleItem key={article.id} article={article} />
                            )}
                        </div>
                    ))}

                    {/* Loader cuối danh sách khi đang fetch thêm */}
                    {getAllArticle.isFetching && articles.length > 0 && (
                        <div
                            key={`loading-${page}`}
                            data-grid-groupkey={page + 0.5} // nhóm tạm cho loader
                            style={{ width: `${columnWidthPx}px` }}
                            className="mb-5"
                        >
                            <Skeleton className="h-64 w-full rounded-xl" />
                        </div>
                    )}
                </MasonryInfiniteGrid>
            )}
        </div>
    );
}
