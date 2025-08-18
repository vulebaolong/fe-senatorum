"use client";

import { useGetDetailArticle } from "@/api/tantask/article.tanstack";
import ButtonIcon from "@/components/custom/button-custom/button-icon";
import ImageCustom from "@/components/custom/image-custom/ImageCustom";
import { OverlayState } from "@/components/data-state/overlay-state/OverlayState";
import IconArrowDown from "@/components/icon/icon-arrow-down";
import IconArrowUp from "@/components/icon/icon-arrow-up";
import Editor from "@/components/lexical/editor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY } from "@/constant/app.constant";
import { TArticle } from "@/types/article.type";
import { Bookmark, Eye, MessageCircle, Share2 } from "lucide-react";
import FacebookIcon from "./icon-social/facebook-icon";
import InstagramIcon from "./icon-social/instagram-icon";
import RedditIcon from "./icon-social/reddit-icon";
import XIcon from "./icon-social/x-icon";
import CommentList from "@/components/comment/comment-list";
import { useState } from "react";
import { TListComment } from "@/types/comment.type";
import CommentInput from "@/components/comment/comment-input/comment-input";
import ArticleVote from "../article-vote/article-vote";
import ArticleFooter from "../article-footer/article-footer";

type TProps = {
    slug: string;
};

export default function ArticleDetail({ slug }: TProps) {
    const getDetailArticle = useGetDetailArticle(slug);
    const [listComment, setListComment] = useState<TListComment[]>([]);

    return (
        <div className="p-5 h-[calc(100vh-var(--header-height))] overflow-y-scroll">
            <div className="relative h-full flex flex-col">
                <OverlayState<TArticle>
                    isLoading={getDetailArticle.isLoading}
                    data={getDetailArticle.data}
                    isError={getDetailArticle.isError}
                    content={(data) => {
                        return (
                            <div className="overflow-y-auto space-y-2">
                                <Badge variant="secondary">{data.Types.name}</Badge>

                                <div className="flex-1 grid gap-10 [grid-template-columns:0.75fr_0.25fr]">
                                    <div className="flex flex-col gap-10">
                                        <div className=" grid gap-5 [grid-template-columns:0.45fr_0.55fr]">
                                            <div className="w-full h-full border-sidebar-border border shadow-sm aspect-video overflow-hidden rounded-xl">
                                                <ImageCustom src={`${NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY}${data.thumbnail}`} alt={data.slug} />
                                            </div>
                                            <div className="w-full h-full flex flex-col gap-2 justify-between">
                                                <div className="flex items-center gap-2">
                                                    {data.ArticleCategories.map((item, i) => (
                                                        <Badge variant="outline" key={i}>
                                                            {item.Categories.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                                <div className="text-3xl font-bold line-clamp-3 h-[110px]">
                                                    {data.title}The Feds Interest The Feds Interest The Feds Interest The Feds Interest The Feds
                                                    Interest The Feds Interest The Feds Interest
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {/* <Avatar className="h-10 w-10 rounded-full">
                                                        <AvatarImage src={data.Users.avatar} alt={data.Users.name} />
                                                        <AvatarFallback className="rounded-full text-xs">
                                                            {data.Users.name.slice(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar> */}

                                                    <div className="flex flex-1 items-center gap-2 py-1.5 text-left text-sm">
                                                        <Avatar className="h-8 w-8 rounded-full">
                                                            <AvatarImage src={data.Users.avatar} alt={data.Users.name} />
                                                            <AvatarFallback className="rounded-lg">
                                                                {data.Users.name.slice(0, 2).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                                            <span className="truncate font-medium">{data.Users.name}</span>
                                                            <span className="truncate text-xs text-muted-foreground">{data.Users.email}</span>
                                                        </div>
                                                    </div>

                                                    <Button>Follow</Button>
                                                </div>

                                                <ArticleFooter article={data} />
                                            </div>
                                        </div>

                                        <div className="">
                                            <div className="grid gap-0 [grid-template-columns:50px_1fr]">
                                                <div className="sticky top-0 self-start p-2 flex flex-col items-center justify-center border rounded-xl">
                                                    <FacebookIcon />
                                                    <XIcon />
                                                    <InstagramIcon />
                                                    <RedditIcon />
                                                </div>
                                                <div className="">
                                                    <Editor isViewOnly initialContentJSON={data.content} />
                                                    <div className="py-5 px-2">
                                                        <CommentInput article={data} setListComment={setListComment} commentParent={null} />
                                                    </div>
                                                    <CommentList article={data} listComment={listComment} setListComment={setListComment} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sticky top-0 self-start h-fit"></div>
                                </div>
                            </div>
                        );
                    }}
                />
            </div>
        </div>
    );
}
