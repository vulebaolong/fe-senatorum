"use client";

import { useGetAllPost, useGetMyPost, useGetOtherPost } from "@/api/tantask/post.tanstack";
import { formatLocalTime } from "@/helpers/function.helper";
import { TArticle } from "@/types/article.type";
import { ArrowDown, ArrowUp, Bookmark, Ellipsis, Eye, MessageCircle, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { VirtuosoGrid, VirtuosoHandle } from "react-virtuoso";
import ImageCustom from "../custom/image-custom/ImageCustom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardAction, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import SkeletonPost from "./skeleton/skeleton-post";

type TProps = {
    filters?: Record<string, any>;
    id?: string;
    type: "all" | "my" | "other";
    className?: string;
};

export default function Postlist({ filters, id, type, className }: TProps) {
    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState<TArticle[]>([]);
    const pageSize = 10;
    const virtuosoRef = useRef<VirtuosoHandle>(null);
    const totalPageRef = useRef(0);

    const getAllPost = (() => {
        if (type === "all") return useGetAllPost;
        if (type === "my") return useGetMyPost;
        return useGetOtherPost;
    })()({
        pagination: { pageIndex: page, pageSize },
        filters,
        id: id,
        sort: { sortBy: `createdAt`, isDesc: true },
    });

    useEffect(() => {
        if (!getAllPost.data?.items) return;

        const newArticles = getAllPost.data.items;
        setPosts((prev) => {
            if (page === 1) return newArticles;
            return [...prev, ...newArticles];
        });
    }, [getAllPost.data?.items]);

    useEffect(() => {
        if (getAllPost.data?.totalPage) totalPageRef.current = getAllPost.data.totalPage;
    }, [getAllPost.data?.totalPage]);

    const handleEndReached = () => {
        if (getAllPost.isFetching || getAllPost.isLoading || page >= totalPageRef.current) return;
        setPage((prev) => prev + 1);
    };

    return (
        <div className={`relative p-5 ${className}`}>
            <VirtuosoGrid
                ref={virtuosoRef}
                data={posts}
                style={{ height: `100%` }}
                context={{ isLoading: getAllPost.isLoading }}
                listClassName="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                // listClassName="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]"
                itemContent={(i, post: TArticle) => {
                    return (
                        <Card
                            key={post.id}
                            className="min-h-[384px] max-h-[450px] h-full w-full"
                            style={{
                                paddingTop: "clamp(5px, 2vw, 24px)",
                                paddingBottom: "clamp(5px, 2vw, 24px)",
                            }}
                        >
                            {/* header */}
                            <div className="flex items-center justify-between px-6">
                                <div className="flex items-center gap-1">
                                    <Avatar className="h-6 w-6 rounded-full">
                                        <AvatarImage src={post.Users.avatar} alt={post.Users.nickName} />
                                        <AvatarFallback className="rounded-full text-xs">
                                            {post.Users.nickName.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <Avatar className="h-8 w-8 rounded-full">
                                        <AvatarImage src={post.Users.avatar} alt={post.Users.nickName} />
                                        <AvatarFallback className="rounded-full text-sm">
                                            {post.Users.nickName.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="">
                                        <p className="text-sm font-semibold truncate">{post.Users.nickName}</p>
                                        <p className="text-xs text-muted-foreground">{formatLocalTime(post.createdAt, `ago`)}</p>
                                    </div>
                                </div>

                                <CardAction className="flex items-center gap-1 h-full">
                                    <Badge variant="secondary">Analysis</Badge>
                                    <Button variant="ghost" size="icon" className="size-6">
                                        <Ellipsis />
                                    </Button>
                                </CardAction>
                            </div>

                            {/* body */}
                            <div
                                className="flex-1 flex flex-col justify-between gap-2"
                                style={{
                                    paddingLeft: "clamp(5px, 2vw, 24px)",
                                    paddingRight: "clamp(5px, 2vw, 24px)",
                                }}
                            >
                                <div className="flex flex-col gap-2">
                                    <CardTitle className="font-bold line-clamp-2">{post.title}</CardTitle>

                                    <div className="flex items-center gap-1 flex-wrap">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Badge key={i} variant="outline">
                                                Outline
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="w-full aspect-video border border-border rounded-lg overflow-hidden">
                                    <ImageCustom src={post.imageUrl} alt={"post image"} />
                                </div>
                            </div>

                            {/* footer */}
                            <div className="space-y-2 px-6">
                                <Separator />

                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center">
                                        <Button variant="ghost" className="size-5">
                                            <ArrowUp className="text-muted-foreground" style={{ width: `10px`, height: `10px` }} />
                                        </Button>
                                        <p className="text-sm font-semibold">{50}</p>
                                        <Button variant="ghost" className="size-5">
                                            <ArrowDown className="text-muted-foreground" style={{ width: `10px`, height: `10px` }} />
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Eye className="text-muted-foreground" size={12} />
                                        <p className="text-xs font-semibold text-muted-foreground">2.1k</p>
                                        <MessageCircle className="text-muted-foreground" size={12} />
                                        <p className="text-xs font-semibold text-muted-foreground">47</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" className="size-5">
                                            <Bookmark className="text-muted-foreground" style={{ width: `10px`, height: `10px` }} />
                                        </Button>
                                        <Button variant="ghost" className="size-5">
                                            <Share2 className="text-muted-foreground" style={{ width: `10px`, height: `10px` }} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    );
                }}
                components={{
                    Footer: ({ context: { isLoading } }) => {
                        return <>{isLoading && <SkeletonPost length={5} />}</>;
                    },
                }}
                endReached={handleEndReached}
            />
        </div>
    );
}
