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
                                        <div className=" grid gap-5 grid-cols-2">
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
                                                    <Avatar className="h-10 w-10 rounded-full">
                                                        <AvatarImage src={data.Users.avatar} alt={data.Users.name} />
                                                        <AvatarFallback className="rounded-full text-xs">
                                                            {data.Users.name.slice(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>

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

                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex-1">
                                                        <div className="flex items-center w-min gap-1 p-0.5 rounded-lg border border-border-subtlest-tertiary">
                                                            <ButtonIcon variant="ghost" size="icon" className="size-6">
                                                                <IconArrowUp className="w-6 h-6 pointer-events-none" />
                                                            </ButtonIcon>
                                                            <p className="text-sm font-semibold">{50}</p>
                                                            <ButtonIcon variant="ghost" size="icon" className="size-6 ">
                                                                <IconArrowDown className="w-6 h-6 pointer-events-none" />
                                                            </ButtonIcon>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-1 items-center gap-1 justify-center">
                                                        <Eye className="text-muted-foreground" size={12} />
                                                        <p className="text-xs font-semibold text-muted-foreground">2.1k</p>
                                                        <MessageCircle className="text-muted-foreground" size={12} />
                                                        <p className="text-xs font-semibold text-muted-foreground">47</p>
                                                    </div>
                                                    <div className="flex flex-1 items-center gap-1 justify-end">
                                                        <ButtonIcon variant="ghost" size="icon" className="size-6">
                                                            <Bookmark style={{ width: `15px`, height: `15px` }} />
                                                        </ButtonIcon>
                                                        <ButtonIcon variant="ghost" size="icon" className="size-6">
                                                            <Share2 style={{ width: `15px`, height: `15px` }} />
                                                        </ButtonIcon>
                                                    </div>
                                                </div>
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
                                                    <div className="py-5">
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
