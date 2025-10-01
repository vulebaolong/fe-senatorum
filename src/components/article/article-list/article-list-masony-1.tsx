// "use client";

// import PostItem from "@/components/post/post-item";
// import { useInfiniteArticles } from "@/hooks/use-infinite-articles";
// import { cn } from "@/lib/utils";
// import { TArticle } from "@/types/article.type";
// import { EArticleVariant } from "@/types/enum/article.enum";
// import { MasonryInfiniteGrid } from "@egjs/react-infinitegrid";
// import { useEffect, useMemo, useRef } from "react";
// import NodataOverlay from "../../no-data/NodataOverlay";
// import { Skeleton } from "../../ui/skeleton";
// import ArticleItem from "../article-item/article-item";

// type ArticleWithGroup = TArticle & { __groupKey: number };

// type TProps = {
//     filters?: Record<string, any>;
//     id?: string;
//     type: "all" | "my" | "upvoted" | "bookmarked" | "heart";
// };

// export default function Articlelist({ filters, id, type }: TProps) {
//     const scrollerRef = useRef<HTMLDivElement>(null);
//     const gridRef = useRef<MasonryInfiniteGrid | null>(null);

//     // Kích thước thẻ và khoảng cách cột
//     const columnWidthPx = 300;
//     const gapPx = 20;
//     const pageSize = 8;

//     const infinite = useInfiniteArticles({
//         type,
//         pageSize,
//         filters,
//         id,
//         sort: { sortBy: "createdAt", isDesc: true },
//     });

//     const flattenedArticles: ArticleWithGroup[] = useMemo(() => {
//         if (!infinite.data?.pages) return [];
//         return infinite.data.pages.flatMap((page) => page.items.map((item) => ({ ...item, __groupKey: page.page })));
//     }, [infinite.data?.pages]);

//     const isEmpty = !infinite.isLoading && flattenedArticles.length === 0;

//     const handleRequestAppend = () => {
//         console.log(123);
//         if (infinite.hasNextPage && !infinite.isFetching && !infinite.isFetchingNextPage) {
//             infinite.fetchNextPage();
//         }
//     };

//     return (
//         <div
//             ref={scrollerRef}
//             className={cn("relative h-[calc(100dvh-var(--header-height))] overflow-y-auto p-5", "min-h-0")}
//             style={{ scrollbarGutter: "stable both-edges" }}
//         >
//             {isEmpty ? (
//                 <NodataOverlay visible />
//             ) : (
//                 <MasonryInfiniteGrid
//                     ref={gridRef}
//                     className="relative"
//                     gap={gapPx}
//                     align="center"
//                     scrollContainer={scrollerRef}
//                     threshold={100}
//                     onRequestAppend={handleRequestAppend}
//                     useRecycle={false}
//                     observedom="false"
//                 >
//                     {flattenedArticles.map((article) => (
//                         <div key={article.id} data-grid-groupkey={article.__groupKey} style={{ width: `${columnWidthPx}px` }}>
//                             {article.variant === EArticleVariant.POST ? (
//                                 <PostItem key={article.id} article={article} gridRef={gridRef} />
//                             ) : (
//                                 <ArticleItem key={article.id} article={article} />
//                             )}
//                         </div>
//                     ))}

//                     {/* Loader cuối danh sách khi đang fetch thêm */}
//                     {infinite.isFetchingNextPage && (
//                         <div
//                             key={`loading-${infinite.data?.pages.length ?? 0}`}
//                             data-grid-groupkey={(infinite.data?.pages.at(-1)?.page ?? 1) + 0.5}
//                             style={{ width: `${columnWidthPx}px` }}
//                         >
//                             <Skeleton className="h-64 w-full rounded-xl" />
//                         </div>
//                     )}
//                 </MasonryInfiniteGrid>
//             )}
//         </div>
//     );
// }
