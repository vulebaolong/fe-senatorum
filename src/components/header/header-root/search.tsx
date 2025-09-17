"use client";

import { getAllArticleAction } from "@/api/actions/article.action";
import { NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY } from "@/constant/app.constant";
import { useDebouncedCallback } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ImageCustom from "../../custom/image-custom/ImageCustom";
import { Button } from "../../ui/button";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "../../ui/command";
import { useAppSelector } from "@/redux/store";

// --- helpers ---
function buildQuery(params: { pageIndex: number; pageSize: number; title: string }) {
    const { pageIndex, pageSize, title } = params;
    const filters = JSON.stringify({ title }); // BE đọc filters.keyword
    const sp = new URLSearchParams({
        page: String(pageIndex),
        pageSize: String(pageSize),
        filters,
        sortBy: "views",
        isDesc: "true",
    });
    return sp.toString();
}

// --- API wrapper bạn đã có ---
async function fetchArticles(title: string, limit = 8) {
    const query = buildQuery({ pageIndex: 1, pageSize: limit, title });
    const res = await getAllArticleAction(query); // <- dùng hàm sẵn có của bạn
    console.log({ getAllArticleAction: res });
    if (res.status === "error" || !res.data) throw new Error(res.message);
    return res.data.items; // TArticle[]
}

export default function Search() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const info = useAppSelector((state) => state.user.info);

    // q = text đang gõ; kw = text đã debounce (đem đi search)
    const [q, setQ] = useState("");
    const [kw, setKw] = useState("");

    // Debounce bằng Mantine (250ms)
    const debounced = useDebouncedCallback((value: string) => {
        setKw(value.trim());
    }, 250);

    // phím tắt ⌘K / Ctrl+K
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((v) => !v);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    // Query search (enabled khi có từ khóa)
    const {
        data: items,
        isFetching,
        isError,
    } = useQuery({
        queryKey: ["article-search", kw],
        enabled: kw.length > 0,
        queryFn: () => fetchArticles(kw, 8),
        staleTime: 30_000,
    });

    // Click 1 item
    const onSelect = (slug: string) => {
        setOpen(false);
        router.push(`/article/${slug}`);
    };

    // Gợi ý khi chưa nhập gì
    const suggestions = useMemo(
        () => [
            { label: "Next.js", q: "nextjs" },
            { label: "React Query", q: "react query" },
            { label: "Authentication", q: "auth" },
            { label: "Performance", q: "perf" },
        ],
        []
    );

    return (
        <>
            <Button
                onClick={() => {
                    if (info) {
                        setOpen(true);
                    } else {
                        router.push("/login");
                    }
                }}
                variant="secondary"
                className="h-full w-full flex items-center justify-between gap-2 rounded-full px-4 dark:bg-muted bg-zinc-100 order-sidebar-border border relative"
            >
                <span className="hidden lg:inline-flex text-xs text-muted-foreground opacity-60">Search Article</span>
                <span className="inline-flex lg:hidden text-xs text-muted-foreground opacity-60">Search...</span>
                <kbd className="bg-background text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium select-none">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>

            <CommandDialog
                open={open}
                onOpenChange={(v) => {
                    setOpen(v);
                    if (!v) {
                        setQ("");
                        setKw("");
                        debounced.cancel(); // hủy debounce nếu đang chờ
                    }
                }}
            >
                <CommandInput
                    autoFocus
                    value={q}
                    onValueChange={(val) => {
                        setQ(val);
                        debounced(val);
                    }}
                    className="w-full"
                    placeholder="Search articles, titles, authors..."
                />

                <CommandList>
                    {/* Loading */}
                    {isFetching && kw.length > 0 && (
                        <div className="px-3 py-2 text-sm text-muted-foreground flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Searching…
                        </div>
                    )}

                    {/* Empty */}
                    {!isFetching && kw.length > 0 && (items?.length ?? 0) === 0 && <CommandEmpty>No results found.</CommandEmpty>}

                    {/* Error */}
                    {isError && kw.length > 0 && <div className="px-3 py-2 text-sm text-red-500">Search failed. Please try again.</div>}

                    {/* Results */}
                    {(items?.length ?? 0) > 0 && (
                        <>
                            <CommandGroup heading="Results">
                                {items!.map((a) => {
                                    return (
                                        <CommandItem
                                            key={a.id}
                                            // Để value chứa title (có dấu) + vài từ khoá phụ
                                            value={`${a.title} ${a.Users?.username ?? ""} ${a.Types?.name ?? ""} ${a.slug}`}
                                            // onSelect của cmdk trả về chính "value", nhưng ta không cần.
                                            // Dùng closure để điều hướng bằng slug:
                                            onSelect={() => onSelect(a.slug)}
                                            className="flex items-center justify-between"
                                            // (tuỳ chọn) nếu bạn dùng cmdk@>=0.2 có prop keywords:
                                            // keywords={[a.title, a.Users?.username ?? "", a.Types?.name ?? "", a.slug]}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-8 h-8 overflow-hidden rounded-md border bg-muted shrink-0">
                                                    <ImageCustom
                                                        src={`${NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY}/${a.thumbnail}`}
                                                        alt={a.title}
                                                        sizes="32px"
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm">{a.title}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {a.Users?.username ? `by ${a.Users.username}` : a.Types?.name ?? "Article"}
                                                    </span>
                                                </div>
                                            </div>
                                            <ArrowUpRight className="w-4 h-4 opacity-60" />
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                            <CommandSeparator />
                        </>
                    )}

                    {/* Suggestions khi chưa nhập */}
                    {q.trim().length === 0 && (
                        <>
                            <CommandGroup heading="Suggestions">
                                {suggestions.map((s) => (
                                    <CommandItem
                                        key={s.q}
                                        value={s.q}
                                        onSelect={(val) => {
                                            // chọn gợi ý → set ngay (không cần debounce)
                                            debounced.cancel();
                                            setQ(val);
                                            setKw(val);
                                        }}
                                        className="justify-between"
                                    >
                                        <span>{s.label}</span>
                                        <kbd className="text-[10px] opacity-70">↵ Insert</kbd>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup heading="Tips">
                                <div className="px-3 py-2 text-xs text-muted-foreground">
                                    Use <kbd className="px-1 py-0.5 border rounded">↑</kbd>/<kbd className="px-1 py-0.5 border rounded">↓</kbd> to
                                    navigate, <kbd className="px-1 py-0.5 border rounded">Enter</kbd> to open.
                                </div>
                            </CommandGroup>
                        </>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    );
}
