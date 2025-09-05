"use client";

import CommentInput from "@/components/comment/comment-input/comment-input";
import CommentList from "@/components/comment/comment-list";
import AvatartImageCustom from "@/components/custom/avatar-custom/avatart-custom";
import ImageCustom from "@/components/custom/image-custom/ImageCustom";
import Editor from "@/components/lexical/editor";
import ProfileFollow from "@/components/profile/profile-follow/profile-follow";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY, NEXT_PUBLIC_BASE_DOMAIN_FE } from "@/constant/app.constant";
import { useAutoArticleView } from "@/hooks/use-article-view";
import { useAppSelector } from "@/redux/store";
import { TResAction } from "@/types/app.type";
import { TArticle } from "@/types/article.type";
import { TListComment } from "@/types/comment.type";
import { CircleX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ArticleFooter from "../article-footer/article-footer";
import ArticleDetailAction from "./article-detail-action";
import ArticleType from "../article-type/article-type";

type TProps = {
    dataDetailArticle: TResAction<TArticle | null>;
};

export default function ArticleDetail({ dataDetailArticle }: TProps) {
    const { data: detailArticle } = dataDetailArticle;
    const info = useAppSelector((state) => state.user.info);
    const [listComment, setListComment] = useState<TListComment[]>([]);
    const router = useRouter();
    dataDetailArticle.data?.id && useAutoArticleView(dataDetailArticle.data?.id, { delayMs: 3500 });

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: dataDetailArticle.data?.title,
        image: dataDetailArticle.data?.thumbnail ? [`${NEXT_PUBLIC_BASE_DOMAIN_FE}/${dataDetailArticle.data?.thumbnail}`] : undefined,
        datePublished: dataDetailArticle.data?.publishedAt,
        dateModified: dataDetailArticle.data?.updatedAt,
        author: dataDetailArticle.data?.Users?.username ? [{ "@type": "Person", name: dataDetailArticle.data?.Users.username }] : undefined,
        mainEntityOfPage: `${NEXT_PUBLIC_BASE_DOMAIN_FE}/articles/${dataDetailArticle.data?.slug}`,
        description: dataDetailArticle.data?.title,
    };

    return (
        <div className="h-[calc(100vh-var(--header-height))] overflow-y-scroll">
            {detailArticle ? (
                <article className="relative flex flex-col p-5">
                    <div className="flex-1 grid gap-10 [grid-template-columns:0.75fr_0.25fr]">
                        <div>
                            <div className="mb-2 flex w-full items-center justify-between">
                                <ArticleType type={detailArticle.Types} />

                                {info?.id === detailArticle.Users.id && <ArticleDetailAction detailArticle={detailArticle} />}
                            </div>

                            <div className="flex flex-col gap-10">
                                <div className=" grid gap-5 [grid-template-columns:0.45fr_0.55fr]">
                                    <div className="w-full h-full border-sidebar-border border shadow-sm aspect-video overflow-hidden rounded-xl">
                                        <ImageCustom
                                            src={`${NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY}/${detailArticle.thumbnail}`}
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
                                        <div className="text-3xl font-bold line-clamp-3 h-[110px]">{detailArticle.title}</div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex flex-1 items-center gap-2 py-1.5 text-left text-sm">
                                                <AvatartImageCustom
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.push(`/${detailArticle.Users.username}`);
                                                    }}
                                                    className="h-8 w-8 rounded-full cursor-pointer"
                                                    name={detailArticle.Users.name}
                                                    src={detailArticle.Users.avatar}
                                                />

                                                <div className="grid flex-1 text-left text-sm leading-tight">
                                                    <span
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.push(`/${detailArticle.Users.username}`);
                                                        }}
                                                        className="truncate font-medium hover:underline cursor-pointer w-fit"
                                                    >
                                                        {detailArticle.Users.name}
                                                    </span>
                                                    <span className="truncate text-xs text-muted-foreground">{detailArticle.Users.email}</span>
                                                </div>
                                            </div>
                                            <>{info?.id !== detailArticle.Users.id && <ProfileFollow user={detailArticle.Users} />}</>
                                        </div>

                                        <ArticleFooter article={detailArticle} />
                                    </div>
                                </div>

                                <div className="">
                                    <Editor isViewOnly initialContentJSON={detailArticle.content} />
                                    <div className="py-5 px-2">
                                        <CommentInput article={detailArticle} setListComment={setListComment} commentParent={null} />
                                    </div>
                                    <CommentList article={detailArticle} listComment={listComment} setListComment={setListComment} />
                                </div>

                                {/* <div className="">
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
                                </div> */}
                            </div>
                        </div>

                        <div className="sticky top-0 self-start h-fit"></div>
                    </div>
                    {/* JSON-LD Article */}
                    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
                </article>
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
