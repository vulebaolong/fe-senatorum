"use client";

import { useGetDetailArticle } from "@/api/tantask/article.tanstack";
import ImageCustom from "@/components/custom/image-custom/ImageCustom";
import { OverlayState } from "@/components/data-state/overlay-state/OverlayState";
import EditorViewer from "@/components/lexical/editor-viewer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TArticle } from "@/types/article.type";
import FacebookIcon from "./icon-social/facebook-icon";
import InstagramIcon from "./icon-social/instagram-icon";
import RedditIcon from "./icon-social/reddit-icon";
import XIcon from "./icon-social/x-icon";
import Editor from "@/components/lexical/editor";

type TProps = {
    slug: string;
};

export default function ArticleDetail({ slug }: TProps) {
    const getDetailArticle = useGetDetailArticle(slug);

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
                                                <ImageCustom src={data.thumbnail} alt={data.slug} />
                                            </div>
                                            <div className="w-full h-full flex flex-col gap-2 justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline">{data.Types.name}</Badge>
                                                    <Badge variant="outline">{data.Types.name}</Badge>
                                                    <Badge variant="outline">{data.Types.name}</Badge>
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

                                                <div className="flex items-center justify-between gap-2">
                                                    <Button variant={"outline"}>Vote</Button>
                                                    <Button variant={"outline"}>View Count</Button>
                                                    <Button variant={"outline"}>Comment</Button>
                                                    <Button variant={"outline"}>Bookmark</Button>
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
                                                    <Editor initialContentJSON={data.content} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sticky top-0 self-start bg-amber-700 h-fit">123</div>
                                </div>
                            </div>
                        );
                    }}
                />
            </div>
        </div>
    );
}
