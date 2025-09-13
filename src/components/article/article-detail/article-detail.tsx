"use client";

import CommentInput from "@/components/comment/comment-input/comment-input";
import CommentList from "@/components/comment/comment-list";
import { Container } from "@/components/container/container";
import AvatartImageCustom from "@/components/custom/avatar-custom/avatart-custom";
import ImageCustom from "@/components/custom/image-custom/ImageCustom";
import Editor from "@/components/lexical/editor";
import { OverflowBadges } from "@/components/overflow-badges/OverflowBadges";
import ProfileFollow from "@/components/profile/profile-follow/profile-follow";
import { NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY, NEXT_PUBLIC_BASE_DOMAIN_FE } from "@/constant/app.constant";
import { formatLocalTime } from "@/helpers/function.helper";
import { useAutoArticleView } from "@/hooks/use-article-view";
import { useAppSelector } from "@/redux/store";
import { TArticle } from "@/types/article.type";
import { TListComment } from "@/types/comment.type";
import { Clock4 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ArticleFooter from "../article-footer/article-footer";
import ArticleType from "../article-type/article-type";
import ArticleDetailAction from "./article-detail-action";

type TProps = {
    article: TArticle;
    isFollowing: boolean;
};

export default function ArticleDetail({ article, isFollowing }: TProps) {
    const info = useAppSelector((state) => state.user.info);
    const [listComment, setListComment] = useState<TListComment[]>([]);
    const router = useRouter();
    article.id && useAutoArticleView(article.id, { delayMs: 3500 });

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        image: article.thumbnail ? [`${NEXT_PUBLIC_BASE_DOMAIN_FE}/${article.thumbnail}`] : undefined,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt,
        author: article.Users?.username ? [{ "@type": "Person", name: article.Users.username }] : undefined,
        mainEntityOfPage: `${NEXT_PUBLIC_BASE_DOMAIN_FE}/articles/${article.slug}`,
        description: article.title,
    };

    return (
        <div className="h-[calc(100dvh-var(--header-height))] overflow-y-scroll">
            {/* <ClickSpark sparkColor="#fff" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}> */}
            <Container as="article" className="py-4 sm:py-6 lg:py-8">
                {/* Mặc định 1 cột; lên lg mới tách 0.73/0.27 */}
                <div className="flex-1 grid gap-5 lg:[grid-template-columns:0.65fr_0.35fr]">
                    {/* Main */}
                    <div className="min-w-0 w-full">
                        <div className="mb-2 flex w-full items-center justify-between">
                            <ArticleType type={article.Types} />
                            {info?.id === article.Users.id && <ArticleDetailAction detailArticle={article} />}
                        </div>

                        <div className="flex flex-col gap-6 md:gap-8 lg:gap-10">
                            {/* Thumb + meta: mobile 1 cột; lg split 60/40 */}
                            {/* <div className="grid gap-4 md:gap-5 lg:[grid-template-columns:0.60fr_0.40fr]"> */}
                            <div className="grid gap-4 md:gap-5">
                                {/* Thumbnail */}
                                <div className="min-w-0 w-full h-full border-sidebar-border border shadow-sm aspect-video overflow-hidden rounded-xl">
                                    <ImageCustom src={`${NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY}/${article.thumbnail}`} alt={article.slug} />
                                </div>

                                {/* Meta */}
                                <div className="min-w-0 w-full h-full flex flex-col gap-3 md:gap-4 lg:gap-2 justify-between">
                                    {/* categories */}
                                    <OverflowBadges
                                        className="h-[22px]"
                                        gapPx={4}
                                        items={article.ArticleCategories.map((it) => `#${it.Categories.name}`)}
                                    />

                                    {/* title + time */}
                                    <div className="text-xl sm:text-2xl md:text-3xl font-bold leading-snug line-clamp-5 md:line-clamp-4 md:h-[96px] lg:h-[128px]">
                                        {article.title}
                                        <br />
                                        <span className="mt-1 inline-flex items-center gap-1 text-muted-foreground text-[11px] sm:text-xs font-medium">
                                            <Clock4 size={12} />
                                            {formatLocalTime(article.publishedAt)}
                                        </span>
                                    </div>

                                    {/* footer */}
                                    <div className="pt-1">
                                        <ArticleFooter article={article} />
                                    </div>

                                    {/* author */}
                                    <div className="flex items-center gap-2">
                                        <div className="flex flex-1 items-center gap-2 py-1.5 text-left text-sm">
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
                                                <span className="truncate text-xs text-muted-foreground">@{article.Users.username}</span>
                                            </div>
                                        </div>
                                        {info?.id !== article.Users.id && (
                                            <div className="shrink-0">
                                                <ProfileFollow isFollowing={isFollowing} followingId={article.Users.id} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Content + comments */}
                            <div>
                                <Editor isViewOnly initialContentJSON={article.content} />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar — chỉ sticky ở lg trở lên */}
                    <div className="min-w-0 w-full lg:sticky lg:top-5 lg:self-start lg:h-fit">
                        <div className="pb-4 md:pb-5 px-1.5 md:px-2">
                            <CommentInput inputId="comment-input" article={article} setListComment={setListComment} commentParent={null} />
                        </div>
                        <CommentList article={article} listComment={listComment} setListComment={setListComment} />
                    </div>
                </div>

                {/* JSON-LD Article */}
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            </Container>
            {/* </ClickSpark> */}
        </div>
    );
}
