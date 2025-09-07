"use client";

import CommentInput from "@/components/comment/comment-input/comment-input";
import CommentList from "@/components/comment/comment-list";
import AvatartImageCustom from "@/components/custom/avatar-custom/avatart-custom";
import ImageCustom from "@/components/custom/image-custom/ImageCustom";
import Editor from "@/components/lexical/editor";
import { OverflowBadges } from "@/components/overflow-badges/OverflowBadges";
import ProfileFollow from "@/components/profile/profile-follow/profile-follow";
import { NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY, NEXT_PUBLIC_BASE_DOMAIN_FE } from "@/constant/app.constant";
import { useAutoArticleView } from "@/hooks/use-article-view";
import { useAppSelector } from "@/redux/store";
import { TArticle } from "@/types/article.type";
import { TListComment } from "@/types/comment.type";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ArticleFooter from "../article-footer/article-footer";
import ArticleType from "../article-type/article-type";
import ArticleDetailAction from "./article-detail-action";
import RelatedSidebar from "@/components/related-sidebar/related-sidebar";

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
        <div className="h-[calc(100vh-var(--header-height))] overflow-y-scroll">
            <article className="relative flex flex-col p-5">
                <div className="flex-1 grid gap-5 [grid-template-columns:0.73fr_0.27fr]">
                    <div className="min-w-0 w-full">
                        <div className="mb-2 flex w-full items-center justify-between">
                            <ArticleType type={article.Types} />

                            {info?.id === article.Users.id && <ArticleDetailAction detailArticle={article} />}
                        </div>

                        <div className="flex flex-col gap-10">
                            <div className="grid gap-5 [grid-template-columns:0.60fr_0.40fr]">
                                <div className="min-w-0 w-full h-full border-sidebar-border border shadow-sm aspect-video overflow-hidden rounded-xl">
                                    <ImageCustom src={`${NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY}/${article.thumbnail}`} alt={article.slug} />
                                </div>

                                <div className="min-w-0 w-full h-full flex flex-col gap-2 justify-between">
                                    <OverflowBadges
                                        className="h-[22px]" // giữ chiều cao 1 dòng nếu muốn
                                        gapPx={4} // khớp với gap-1
                                        items={article.ArticleCategories.map((it) => `#${it.Categories.name}`)}
                                        // moreLabel={(n) => `+${n}`}                // có thể tuỳ biến
                                    />
                                    <div className="text-2xl font-bold line-clamp-4 h-[128px]">{article.title}</div>
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

                                            <div className="grid flex-1 text-left text-sm leading-tight">
                                                <span
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.push(`/${article.Users.username}`);
                                                    }}
                                                    className="truncate font-medium hover:underline cursor-pointer w-fit"
                                                >
                                                    {article.Users.name}
                                                </span>
                                                <span className="truncate text-xs text-muted-foreground">{article.Users.username}</span>
                                            </div>
                                        </div>
                                        <>
                                            {info?.id !== article.Users.id && (
                                                <ProfileFollow isFollowing={isFollowing} followingId={article.Users.id} />
                                            )}
                                        </>
                                    </div>

                                    <ArticleFooter article={article} />
                                </div>
                            </div>

                            <div className="">
                                <Editor isViewOnly initialContentJSON={article.content} />
                                <div className="py-5 px-2">
                                    <CommentInput inputId="comment-input" article={article} setListComment={setListComment} commentParent={null} />
                                </div>
                                <CommentList article={article} listComment={listComment} setListComment={setListComment} />
                            </div>
                        </div>
                    </div>

                    <div className="min-w-0 w-full sticky top-0 self-start h-fit">
                        {/* <RelatedSidebar
                            currentId={article.id}
                            header="Có thể bạn quan tâm"
                            // loading={isLoadingSidebar} // khi bạn fetch thật
                            // items={dataSidebar}        // dữ liệu thật
                        /> */}
                    </div>
                </div>
                {/* JSON-LD Article */}
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            </article>
        </div>
    );
}
