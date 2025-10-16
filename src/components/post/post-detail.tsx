"use client";

import { useGetInfoQuery } from "@/api/tantask/auth.tanstack";
import ArticleFooter from "@/components/article/article-footer/article-footer";
import CommentInput from "@/components/comment/comment-input/comment-input";
import CommentList from "@/components/comment/comment-list";
import { Container } from "@/components/container/container";
import AvatartImageCustom from "@/components/custom/avatar-custom/avatart-custom";
import ProfileFollow from "@/components/profile/profile-follow/profile-follow";
import { Separator } from "@/components/ui/separator";
import { NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY, NEXT_PUBLIC_BASE_DOMAIN_FE } from "@/constant/app.constant";
import { formatLocalTime } from "@/helpers/function.helper";
import { useAutoArticleView } from "@/hooks/use-article-view";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/store";
import { TArticle } from "@/types/article.type";
import { TListComment } from "@/types/comment.type";
import { EArticleVariant } from "@/types/enum/article.enum";
import { Clock4 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ExpandableText from "../expandable-text/ExpandableText";
import { PostCarousel } from "./post-carousel";

type TProps = {
    article: TArticle;
    isFollowing?: boolean;
};

export default function PostDetail({ article, isFollowing }: TProps) {
    useGetInfoQuery();
    const info = useAppSelector((state) => state.user.info);
    const [listComment, setListComment] = useState<TListComment[]>([]);
    const router = useRouter();
    article.id && useAutoArticleView(article.id, { delayMs: 3500 });

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.content,
        image: article.imageUrls?.[0] ? [`${NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY}/${article.imageUrls[0]}`] : undefined,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt,
        author: article.Users?.username ? [{ "@type": "Person", name: article.Users.username }] : undefined,
        mainEntityOfPage: `${NEXT_PUBLIC_BASE_DOMAIN_FE}/post/${article.slug}`,
        description: article.content,
    };

    return (
        <div className="h-[calc(100dvh-var(--header-height))] overflow-y-scroll border-none outline-none">
            <Container as="article" className="py-4 sm:py-6 lg:py-8">
                {/* Mặc định 1 cột; lên lg mới tách 0.73/0.27 */}
                <div className="max-w-2xl mx-auto">
                    <div className="space-y-2 bg-card text-card-foreground rounded-xl border shadow-sm min-h-[0px] h-min w-full cursor-pointer">
                        {/* author */}
                        <div className={cn("flex items-center gap-2 px-2 pt-2")}>
                            <div className="flex flex-1 items-center gap-2 text-left text-sm">
                                <AvatartImageCustom
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/${article.Users.username}`);
                                    }}
                                    className="h-8 w-8 rounded-full cursor-pointer"
                                    name={article.Users.name}
                                    src={article.Users.avatar}
                                />
                                <div className="grid flex-1 text-left leading-tight">
                                    <span
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/${article.Users.username}`);
                                        }}
                                        className="truncate font-medium hover:underline cursor-pointer w-fit text-sm"
                                    >
                                        {article.Users.name}
                                    </span>
                                    <div className="inline-flex items-center gap-1 text-muted-foreground text-[11px] sm:text-xs font-medium">
                                        <Clock4 size={12} />
                                        {formatLocalTime(article.publishedAt)}
                                    </div>
                                </div>
                            </div>
                            {isFollowing && (
                                <>
                                    {info?.id !== article.Users.id && (
                                        <div className="shrink-0">
                                            <ProfileFollow isFollowing={isFollowing} followingId={article.Users.id} />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Content  */}
                        {article.content && (
                            <div className={cn("px-2")}>
                                <ExpandableText
                                    text={article.content}
                                    placement="inline"
                                    maxLines={5}
                                    moreLabel="See more"
                                    lessLabel="See less"
                                    // fadeFromClass="from-[#fff] dark:from-[#171717]"
                                    inlineButtonBgClass="bg-[#fff] dark:bg-[#171717]"
                                    fadeHeightClass="h-full"
                                />
                            </div>
                        )}

                        {/* imageUrls */}
                        {article.imageUrls?.length > 0 && (
                            <div className={cn("px-2")}>
                                <PostCarousel imageUrls={article.imageUrls} />
                            </div>
                        )}

                        <div className="px-2">
                            <Separator />
                        </div>

                        {/* footer */}
                        <div className="px-2">
                            <ArticleFooter article={article} type={EArticleVariant.POST} isEdit={true} />
                        </div>

                        <div className="px-2">
                            <Separator />
                        </div>

                        {/* comment title */}
                        <p className="text-xl font-bold px-2">
                            Comments <span className="text-sm text-muted-foreground">({article.ArticleCounters?.commentCount || 0})</span>
                        </p>
                        {/* comment input */}
                        <div className="px-2">
                            {info && <CommentInput inputId="comment-input" article={article} setListComment={setListComment} commentParent={null} />}
                        </div>

                        {/* comment list */}
                        <CommentList
                            article={article}
                            listComment={listComment}
                            setListComment={setListComment}
                            className={cn("p-2 flex-1 min-h-[500px]")}
                        />
                    </div>
                </div>

                {/* JSON-LD Article */}
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            </Container>
        </div>
    );
}
