"use client";

import CommentInput from "@/components/comment/comment-input/comment-input";
import CommentList from "@/components/comment/comment-list";
import ImageCustom from "@/components/custom/image-custom/ImageCustom";
import Editor from "@/components/lexical/editor";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY } from "@/constant/app.constant";
import useRouter from "@/hooks/use-router-custom";
import { useAppSelector } from "@/redux/hooks";
import { TResAction } from "@/types/app.type";
import { TArticle } from "@/types/article.type";
import { TListComment } from "@/types/comment.type";
import { CircleX, Pencil } from "lucide-react";
import { useState } from "react";
import ArticleFooter from "../article-footer/article-footer";
import FacebookIcon from "./icon-social/facebook-icon";
import InstagramIcon from "./icon-social/instagram-icon";
import RedditIcon from "./icon-social/reddit-icon";
import XIcon from "./icon-social/x-icon";

type TProps = {
    dataDetailArticle: TResAction<TArticle | null>;
};

export default function ArticleDetail({ dataDetailArticle }: TProps) {
    const { data: detailArticle } = dataDetailArticle;
    const info = useAppSelector((state) => state.user.info);
    const [listComment, setListComment] = useState<TListComment[]>([]);
    const router = useRouter();

    return (
        <div className="p-5 h-[calc(100vh-var(--header-height))] overflow-y-scroll">
            {detailArticle ? (
                <div className="relative h-full flex flex-col">
                    <div className="overflow-y-auto space-y-2">
                        <Badge variant="secondary">{detailArticle.Types.name}</Badge>

                        <div className="flex-1 grid gap-10 [grid-template-columns:0.75fr_0.25fr]">
                            <div className="flex flex-col gap-10">
                                <div className=" grid gap-5 [grid-template-columns:0.45fr_0.55fr]">
                                    <div className="w-full h-full border-sidebar-border border shadow-sm aspect-video overflow-hidden rounded-xl">
                                        <ImageCustom
                                            src={`${NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY}${detailArticle.thumbnail}`}
                                            alt={detailArticle.slug}
                                        />
                                    </div>
                                    <div className="w-full h-full flex flex-col gap-2 justify-between">
                                        <div className="flex items-center gap-2">
                                            {detailArticle.ArticleCategories.map((item, i) => (
                                                <Badge variant="outline" key={i}>
                                                    {item.Categories.name}
                                                </Badge>
                                            ))}
                                        </div>
                                        <div className="text-3xl font-bold line-clamp-3 h-[110px]">
                                            {detailArticle.title}The Feds Interest The Feds Interest The Feds Interest The Feds Interest The Feds
                                            Interest The Feds Interest The Feds Interest
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex flex-1 items-center gap-2 py-1.5 text-left text-sm">
                                                <Avatar className="h-8 w-8 rounded-full">
                                                    <AvatarImage src={detailArticle.Users.avatar} alt={detailArticle.Users.name} />
                                                    <AvatarFallback className="rounded-lg">
                                                        {detailArticle.Users.name.slice(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="grid flex-1 text-left text-sm leading-tight">
                                                    <span className="truncate font-medium">{detailArticle.Users.name}</span>
                                                    <span className="truncate text-xs text-muted-foreground">{detailArticle.Users.email}</span>
                                                </div>
                                            </div>
                                            {info?.id && (
                                                <>
                                                    {info?.id === detailArticle.Users.id ? (
                                                        <Button
                                                            onClick={() => router.push(`/article/${detailArticle.slug}/edit`)}
                                                            variant={"outline"}
                                                            size="icon"
                                                            className="size-8"
                                                        >
                                                            <Pencil />
                                                        </Button>
                                                    ) : (
                                                        <Button>Follow</Button>
                                                    )}
                                                </>
                                            )}
                                        </div>

                                        <ArticleFooter article={detailArticle} />
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
                                            <Editor isViewOnly initialContentJSON={detailArticle.content} />
                                            <div className="py-5 px-2">
                                                <CommentInput article={detailArticle} setListComment={setListComment} commentParent={null} />
                                            </div>
                                            <CommentList article={detailArticle} listComment={listComment} setListComment={setListComment} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="sticky top-0 self-start h-fit"></div>
                        </div>
                    </div>
                </div>
            ) : (
                <Alert variant="default">
                    <CircleX color="red" />
                    <AlertTitle>No article</AlertTitle>
                    <AlertDescription>No article</AlertDescription>
                </Alert>
            )}
        </div>
    );
}
