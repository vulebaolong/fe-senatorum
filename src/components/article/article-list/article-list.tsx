"use client";

import {
    useGetAllArticle,
    useGetMyArticle,
    useGetMyBookmarkedArticle,
    useGetMyHeartArticle,
    useGetMyUpvotedArticle,
} from "@/api/tantask/article.tanstack";
import { AppendLoading } from "@/components/data-state/append-state/AppendState";
import PostItem from "@/components/post/post-item";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/store";
import { TQuery } from "@/types/app.type";
import { TArticle } from "@/types/article.type";
import { EArticleVariant } from "@/types/enum/article.enum";
import { useEffect, useMemo, useRef, useState } from "react";
import NodataOverlay from "../../no-data/NodataOverlay";
import { Skeleton } from "../../ui/skeleton";
import ArticleItem from "../article-item/article-item";
import GalleryImageItem from "@/components/gallery/gallery-image-item";

type ArticleWithGroup = TArticle & { __groupKey: number };

type TProps = {
    filters?: Record<string, any>;
    type: "all" | "my" | "upvoted" | "bookmarked" | "heart";
};

export default function Articlelist({ filters, type }: TProps) {
    const [lastArticleId, setLastArticleId] = useState<string | undefined>(undefined);
    const [articles, setArticles] = useState<TArticle[]>([]);
    const articleNew = useAppSelector((state) => state.article.articleNew);

    const containerRef = useRef<HTMLDivElement | null>(null);


    const totalItemRef = useRef(0);
    const lastAppliedFilterRef = useRef<string>("");
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
        sort: { sortBy: `publishedAt`, isDesc: true },
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

    const handleEndReached = () => {
        if (canLoadMore) {
            setLastArticleId(articles[articles.length - 1].id);
        }
    };
    
    // const isEmpty = articles.length === 0 && !getAllArticle.isLoading;

    return (
        <div ref={containerRef} className={`relative p-5 gap-5 h-[calc(100dvh-var(--header-height))] overflow-y-scroll`}>
            <div
                className={cn(
                    "relative flex flex-col gap-5",
                    "max-w-2xl mx-auto",
                    "min-h-full",
                )}
            >
                <AppendLoading
                    isLoading={getAllArticle.isLoading}
                    isEmpty={articles.length === 0}
                    isError={getAllArticle.isError}
                    onLoadMore={handleEndReached}
                    containerRef={containerRef}
                    footerLoadingComponent={Array.from({ length: 10 }).map((_, i) => (
                        <Skeleton key={i} className={cn(`h-full w-full rounded-xl`)} />
                    ))}
                    initialLoadingComponent={Array.from({ length: 10 }).map((_, i) => (
                        <Skeleton key={i} className={cn(`h-full w-full rounded-xl`)} />
                    ))}
                    noDataComponent={<NodataOverlay visible />}
                >
                    {articles.map((article) => {
                        if (article.variant === EArticleVariant.POST) {
                            return <PostItem key={article.id} article={article} />;
                        }
                        if (article.variant === EArticleVariant.ARTICLE) {
                            return <ArticleItem key={article.id} article={article} />;
                        }
                        if (article.variant === EArticleVariant.IMAGE) {
                            return <GalleryImageItem key={article.id} article={article} />;
                        }
                    })}
                </AppendLoading>
            </div>
        </div>
    );
}
