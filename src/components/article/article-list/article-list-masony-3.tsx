"use client";

import {
    useGetAllArticle,
    useGetMyArticle,
    useGetMyBookmarkedArticle,
    useGetMyHeartArticle,
    useGetMyUpvotedArticle,
} from "@/api/tantask/article.tanstack";
import ImageCustom from "@/components/custom/image-custom/ImageCustom";
import { FALLBACK_IMAGE, NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY } from "@/constant/app.constant";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/store";
import { TQuery } from "@/types/app.type";
import { TArticle } from "@/types/article.type";
import { MasonryInfiniteGrid } from "@egjs/react-infinitegrid";
import { useEffect, useMemo, useRef, useState } from "react";
import NodataOverlay from "../../no-data/NodataOverlay";
import GalleryImageItem1 from "@/components/gallery/gallery-image-item1";

type ArticleWithGroup = TArticle & { __groupKey: number };

type TProps = {
    filters?: Record<string, any>;
    type: "all" | "my" | "upvoted" | "bookmarked" | "heart";
};

// Kích thước thẻ và khoảng cách cột
const columnWidthPx = 300;
const gapPx = 10;
const pageSize = 10;

export default function ArticlelistMasony({ filters, type }: TProps) {
    const [lastArticleId, setLastArticleId] = useState<string | undefined>(undefined);
    const [articles, setArticles] = useState<TArticle[]>([]);
    const articleNew = useAppSelector((state) => state.article.articleNew);

    const totalItemRef = useRef(0);
    const lastAppliedFilterRef = useRef<string>("");
    const scrollerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<MasonryInfiniteGrid | null>(null);

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
                <>
                    {scrollerRef && (
                        <MasonryInfiniteGrid
                            ref={gridRef}
                            /* --- Bố cục & tính toán --- */
                            gap={gapPx}
                            align="center"
                            columnSize={columnWidthPx} // cột cố định -> ít tính toán hơn
                            columnCalculationThreshold={10} // chỉ tính lại khi container đổi ≥120px
                            useFit={false} // bỏ bước fit-compact tốn CPU
                            useRoundedSize={true} // giảm rung layout
                            /* --- Cuộn vô hạn & ảo hóa --- */
                            scrollContainer={scrollerRef}
                            threshold={10} // ngưỡng nạp nhỏ để ít event
                            useRecycle={true} // TÁI DÙNG NODE: bắt buộc để nhẹ
                            placeholder={<div style={{ height: 240 }} />} // khung tạm, rẻ CPU
                            /* --- Quan sát/resize --- */
                            autoResize={false} // tắt lắng nghe resize chung
                            useResizeObserver={true} // nếu cần, chỉ dùng RO (nhẹ hơn)
                            resizeDebounce={500}
                            maxResizeDebounce={500}
                            /* --- Ổn định & giảm reflow --- */
                            observeChildren={false} // đừng quan sát con tự động
                            renderOnPropertyChange={false} // props đổi ít khi -> tránh relayout
                            /* --- Sự kiện nạp dữ liệu --- */
                            onRequestAppend={handleRequestAppend}
                            onRenderComplete={() => {
                                // có thể lazy hydrate analytics/things sau khi ổn định
                            }}
                        >
                            {articles.map((article) => (
                                <div key={article.id} style={{ width: `${columnWidthPx}px` }}>
                                    <GalleryImageItem1 article={article} />
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
                </>
            )}
        </div>
    );
}
