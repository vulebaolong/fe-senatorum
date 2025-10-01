"use client";

import {
    useGetAllArticle,
    useGetMyArticle,
    useGetMyBookmarkedArticle,
    useGetMyHeartArticle,
    useGetMyUpvotedArticle,
} from "@/api/tantask/article.tanstack";
import PostItem from "@/components/post/post-item";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/store";
import { TQuery } from "@/types/app.type";
import { TArticle } from "@/types/article.type";
import { EArticleVariant } from "@/types/enum/article.enum";
import { MasonryInfiniteGrid } from "@egjs/react-infinitegrid";
import { useEffect, useMemo, useRef, useState } from "react";
import NodataOverlay from "../../no-data/NodataOverlay";
import ArticleItem from "../article-item/article-item";

type ArticleWithGroup = TArticle & { __groupKey: number };

type TProps = {
    filters?: Record<string, any>;
    type: "all" | "my" | "upvoted" | "bookmarked" | "heart";
};

export default function Articlelist({ filters, type }: TProps) {
    const [lastArticleId, setLastArticleId] = useState<string | undefined>(undefined);
    const [articles, setArticles] = useState<TArticle[]>([]);
    const articleNew = useAppSelector((state) => state.article.articleNew);

    const totalItemRef = useRef(0);
    const lastAppliedFilterRef = useRef<string>("");
    const scrollerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<MasonryInfiniteGrid | null>(null);

    // Kích thước thẻ và khoảng cách cột
    const columnWidthPx = 300;
    const gapPx = 20;
    const pageSize = 10;

    const getArticleHook = useMemo(() => {
        if (type === "all") return useGetAllArticle;
        if (type === "upvoted") return useGetMyUpvotedArticle;
        if (type === "bookmarked") return useGetMyBookmarkedArticle;
        if (type === "heart") return useGetMyHeartArticle;
        return useGetMyArticle;
    }, [type]);

    const queryPayload: TQuery = {
        pagination: { pageSize, afterUUIDv7: lastArticleId },
        filters: filters || {},
        sort: { sortBy: `createdAt`, isDesc: true },
    };

    const filterKey = useMemo(() => JSON.stringify({ filters, type }), [filters, type]);

    // Khi filter/type thay đổi -> reset danh sách & trang
    useEffect(() => {
        if (lastAppliedFilterRef.current !== filterKey) {
            lastAppliedFilterRef.current = filterKey;
            // setPage(1);
            setArticles([]);
        }
    }, [filterKey]);

    const getAllArticle = getArticleHook(queryPayload);

    useEffect(() => {
        const received = getAllArticle.data?.items;
        if (!received) return;

        // const receivedWithGroup: ArticleWithGroup[] = received.map((a) => ({
        //     ...a,
        //     __groupKey: page, // gắn group theo trang hiện tại
        // }));

        setArticles((previous) => {
            if (previous.length === 0) return received;
            return [...previous, ...received];
        });
    }, [getAllArticle.data?.items]);

    useEffect(() => {
        if (!articleNew) return;

        const articleNewWithGroup: ArticleWithGroup = {
            ...articleNew,
            __groupKey: 0,
        };

        setArticles((previous) => {
            if (previous.length === 0) return [articleNewWithGroup];
            return [articleNewWithGroup, ...previous];
        });
    }, [articleNew?.id]);

    useEffect(() => {
        if (getAllArticle.data?.totalItem) {
            totalItemRef.current = getAllArticle.data.totalItem;
        }
    }, [getAllArticle.data?.totalItem]);

    const canLoadMore = !getAllArticle.isFetching && !getAllArticle.isLoading && articles.length < totalItemRef.current;

    const handleRequestAppend = () => {
        if (canLoadMore) {
            setLastArticleId(articles[articles.length - 1].id);
        }
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
                    threshold={10}
                    onRequestAppend={handleRequestAppend}
                    useRecycle={false}
                    observedom="false"
                >
                    {articles.map((article) => (
                        <div key={article.id} style={{ width: `${columnWidthPx}px` }}>
                            {article.variant === EArticleVariant.POST ? (
                                <PostItem key={article.id} article={article} gridRef={gridRef} />
                            ) : (
                                <ArticleItem key={article.id} article={article} />
                            )}
                        </div>
                    ))}

                    {/* Loader cuối danh sách khi đang fetch thêm */}
                    {/* {getAllArticle.isFetching && articles.length > 0 && (
                        <div
                            key={`loading-${page}`}
                            data-grid-groupkey={page + 0.5} // nhóm tạm cho loader
                            style={{ width: `${columnWidthPx}px` }}
                            className="mb-5"
                        >
                            <Skeleton className="h-64 w-full rounded-xl" />
                        </div>
                    )} */}
                </MasonryInfiniteGrid>
            )}
        </div>
    );
}

