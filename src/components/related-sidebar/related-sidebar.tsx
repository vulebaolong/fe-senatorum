// components/RelatedSidebar.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Clock, Eye, Newspaper } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import ImageCustom from "../custom/image-custom/ImageCustom";
import { NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY, TITLE } from "@/constant/app.constant";
// Nếu bạn có ImageCustom thì dùng cho đồng nhất:

type RelatedItem = {
    id: string;
    slug: string;
    title: string;
    thumbnail: string | null;
    category: string; // hiển thị badge
    type: string; // subtype/bộ sưu tập
    publishedAt: string; // ISO
    readMins?: number; // phút đọc
    views7d?: number; // view 7 ngày
};

type RelatedSidebarProps = {
    items?: RelatedItem[]; // nếu không truyền sẽ dùng MOCK
    loading?: boolean; // hiển thị skeleton
    className?: string;
    header?: string;
    currentId?: string; // để làm nổi bật/ẩn bài hiện tại (nếu muốn)
    onItemClick?: (it: RelatedItem) => void;
};

const MOCK: RelatedItem[] = [
    {
        id: "a1",
        slug: "react-18-concurrency-explained",
        title: "Giải thích Concurrency của React 18: từ Suspense đến Transitions",
        thumbnail: `${NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY}/${TITLE}/articles/thumbnails/g2penimd5uwtjbtxwqhi`,
        category: "Frontend",
        type: "Kỹ thuật",
        publishedAt: "2025-08-20T10:00:00.000Z",
        readMins: 7,
        views7d: 1240,
    },
    {
        id: "a2",
        slug: "designing-rest-apis-that-scale",
        title: "Thiết kế REST API có thể mở rộng: thực hành & bẫy thường gặp",
        thumbnail: `${NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY}/${TITLE}/articles/thumbnails/g2penimd5uwtjbtxwqhi`,
        category: "Backend",
        type: "Best Practice",
        publishedAt: "2025-08-28T09:30:00.000Z",
        readMins: 9,
        views7d: 2380,
    },
    {
        id: "a3",
        slug: "nuxt-next-or-sveltekit",
        title: "Nuxt, Next hay SvelteKit cho dự án tiếp theo?",
        thumbnail: `${NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY}/${TITLE}/articles/thumbnails/g2penimd5uwtjbtxwqhi`,
        category: "Architecture",
        type: "So sánh",
        publishedAt: "2025-08-10T15:10:00.000Z",
        readMins: 6,
        views7d: 980,
    },
    {
        id: "a4",
        slug: "database-indexing-cheatsheet",
        title: "Indexing cheat-sheet: từ B-Tree đến GIN/GiST và khi nào dùng",
        thumbnail: `${NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY}/${TITLE}/articles/thumbnails/g2penimd5uwtjbtxwqhi`,
        category: "Database",
        type: "Cheat-sheet",
        publishedAt: "2025-07-29T11:00:00.000Z",
        readMins: 5,
        views7d: 1630,
    },
];

export default function RelatedSidebar({
    items = MOCK,
    loading,
    className,
    header = "Bài viết liên quan",
    currentId,
    onItemClick,
}: RelatedSidebarProps) {
    const router = useRouter();

    return (
        <aside className={cn("sticky top-0 self-start h-fit w-full", className)} aria-label="Related articles">
            <Card className="border-border/60 bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/50">
                <div className="flex items-center gap-2 p-3 pb-2">
                    <div className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Newspaper className="h-3.5 w-3.5" />
                    </div>
                    <h3 className="text-sm font-semibold">{header}</h3>
                </div>

                <div className="px-3 pb-3">
                    {loading ? (
                        <SkeletonList />
                    ) : (
                        <ul className="space-y-2.5">
                            {items
                                .filter((it) => it.id !== currentId) // ẩn bài hiện tại (nếu truyền currentId)
                                .map((it) => (
                                    <li key={it.id}>
                                        <ArticleRow
                                            item={it}
                                            onClick={() => {
                                                onItemClick?.(it);
                                                router.push(`/articles/${it.slug}`);
                                            }}
                                        />
                                    </li>
                                ))}
                        </ul>
                    )}
                </div>
            </Card>
        </aside>
    );
}

function ArticleRow({ item, onClick }: { item: RelatedItem; onClick?: () => void }) {
    return (
        <motion.button
            type="button"
            whileHover={{ y: -1 }}
            transition={{ duration: 0.18 }}
            onClick={onClick}
            className={cn(
                "group w-full overflow-hidden rounded-lg border border-transparent text-left outline-none",
                "hover:border-border/80 hover:bg-muted/30 focus-visible:ring-2 focus-visible:ring-primary/50"
            )}
        >
            <div className="flex gap-3 p-2">
                {/* Thumb */}
                <div className="relative min-w-0 flex-1 aspect-video overflow-hidden rounded-md bg-muted">
                    {item.thumbnail ? (
                        <div className="h-full w-full">
                            <ImageCustom
                                src={item.thumbnail}
                                alt={item.title}
                                className="transition-transform duration-300 group-hover:scale-[1.04]"
                            />
                        </div>
                    ) : (
                        <div className="h-full w-full" />
                    )}
                    {/* Overlay info nhẹ */}
                    {typeof item.views7d === "number" && (
                        <div className="pointer-events-none absolute bottom-1 left-1 inline-flex items-center gap-1.5 rounded bg-black/55 px-1.5 py-[2px] text-[10px] text-white">
                            <Eye className="h-[12px] w-[12px]" />
                            {Intl.NumberFormat("en-US", { notation: "compact" }).format(item.views7d)}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-1.5">
                        <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                            {item.category}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">•</span>
                        <span className="text-[10px] text-muted-foreground">{item.type}</span>
                    </div>

                    <h4
                        className={cn("line-clamp-2 text-sm font-medium leading-snug", "transition-colors group-hover:text-foreground")}
                        title={item.title}
                    >
                        {item.title}
                    </h4>

                    <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                        {/* {item.readMins ? (
                            <span className="inline-flex items-center gap-1">
                                <Clock className="h-[12px] w-[12px]" />
                                {item.readMins} phút đọc
                            </span>
                        ) : null} */}
                        {/* <span className="select-none">•</span> */}
                        <time dateTime={item.publishedAt}>{formatRelative(item.publishedAt)}</time>
                    </div>
                </div>
            </div>
        </motion.button>
    );
}

function SkeletonList() {
    return (
        <ul className="space-y-2.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <li key={i} className="w-full overflow-hidden rounded-lg border border-border/50">
                    <div className="flex gap-3 p-2">
                        <Skeleton className="h-[70px] w-[104px] rounded-md" />
                        <div className="min-w-0 flex-1">
                            <div className="mb-1 flex items-center gap-2">
                                <Skeleton className="h-4 w-16 rounded" />
                                <Skeleton className="h-4 w-14 rounded" />
                            </div>
                            <Skeleton className="mb-1 h-4 w-[92%]" />
                            <Skeleton className="h-4 w-[70%]" />
                            <div className="mt-2 flex items-center gap-2">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}

function formatRelative(iso: string) {
    try {
        const d = new Date(iso);
        const diff = (Date.now() - d.getTime()) / 1000;
        if (diff < 60) return "vừa xong";
        if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
        const days = Math.floor(diff / 86400);
        if (days < 7) return `${days} ngày trước`;
        return d.toLocaleDateString("vi-VN");
    } catch {
        return iso;
    }
}
