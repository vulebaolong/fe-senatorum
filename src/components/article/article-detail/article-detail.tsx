"use client";

import { useArticleViewEasy } from "@/api/tantask/article-view.tanstack";
import { useGetInfoQuery } from "@/api/tantask/auth.tanstack";
import CommentInput from "@/components/comment/comment-input/comment-input";
import CommentList from "@/components/comment/comment-list";
import { Container } from "@/components/container/container";
import AvatartImageCustom from "@/components/custom/avatar-custom/avatart-custom";
import ImageCustom from "@/components/custom/image-custom/ImageCustom";
import Editor from "@/components/lexical/editor";
import { OverflowBadges } from "@/components/overflow-badges/OverflowBadges";
import ProfileFollow from "@/components/profile/profile-follow/profile-follow";
import { Separator } from "@/components/ui/separator";
import { NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY, NEXT_PUBLIC_BASE_DOMAIN_FE } from "@/constant/app.constant";
import { formatLocalTime } from "@/helpers/function.helper";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/store";
import { TArticle } from "@/types/article.type";
import { TListComment } from "@/types/comment.type";
import { EArticleVariant } from "@/types/enum/article.enum";
import { Clock4 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ArticleFooter from "../article-footer/article-footer";
import ArticleType from "../article-type/article-type";

type TProps = {
    article: TArticle;
    isFollowing?: boolean;
};

export default function ArticleDetail({ article, isFollowing }: TProps) {
    useGetInfoQuery();
    const info = useAppSelector((state) => state.user.info);
    const [listComment, setListComment] = useState<TListComment[]>([]);
    const router = useRouter();
    // article.id && useAutoArticleView(article.id, { delayMs: 3500 });
    useArticleViewEasy(article.id);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        image: article.thumbnail ? [`${NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY}/${article.thumbnail}`] : undefined,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt,
        author: article.Users?.username ? [{ "@type": "Person", name: article.Users.username }] : undefined,
        mainEntityOfPage: `${NEXT_PUBLIC_BASE_DOMAIN_FE}/articles/${article.slug}`,
        description: article.title,
    };

    return (
        <div className="h-[calc(100dvh-var(--header-height))] overflow-y-scroll border-none outline-none">
            {/* <ClickSpark sparkColor="#fff" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}> */}
            <Container as="article" className="py-4 sm:py-6 lg:py-8">
                {/* Mặc định 1 cột; lên lg mới tách 0.73/0.27 */}
                <div className="flex-1 grid gap-10 lg:[grid-template-columns:0.65fr_0.35fr]">
                    {/* left */}
                    <div className=" min-w-0 w-full">
                        <div className="flex flex-col gap-0">
                            <div className="relative">
                                {/* article - thumbnail */}
                                <div className="min-w-0 w-full h-full aspect-[632/355] overflow-hidden rounded-t-lg">
                                    <ImageCustom
                                        src={`${NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY}/${article.thumbnail}`}
                                        alt={article.slug}
                                        imageFor="hero"
                                    />
                                </div>

                                {/* article - type */}
                                <div className="absolute top-0 flex w-full items-center justify-between p-5 h-auto">
                                    <ArticleType type={article.Types} />
                                </div>

                                {/* article - overlay thumbnail */}
                                <div
                                    className={cn(
                                        "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t rounded-b-[inherit] to-transparent",
                                        "from-[rgba(0,0,0,0.5)] dark:from-[#333334]",
                                        "h-1/3"
                                    )}
                                />

                                {/* article - categories */}
                                <div className="absolute inset-x-0 bottom-0 p-5">
                                    <OverflowBadges
                                        className="h-[22px]"
                                        classNameBadge="text-black bg-white"
                                        variant={"secondary"}
                                        gapPx={4}
                                        items={article.ArticleCategories.map((it) => `#${it.Categories.name}`)}
                                    />
                                </div>
                            </div>

                            {/* Meta */}
                            <div
                                className={cn(
                                    "py-5 min-w-0 w-full h-full flex flex-col gap-3 md:gap-4 lg:gap-2 justify-between bg-background",
                                    "px-2"
                                )}
                            >
                                {/* title */}
                                <p
                                    className={cn(
                                        // typography
                                        "font-bold tracking-tight leading-tight break-words truncate",

                                        // cân chữ đẹp trên trình duyệt hỗ trợ
                                        "supports-[text-wrap:balance]:text-balance",

                                        // cỡ chữ theo breakpoint
                                        "text-xl sm:text-2xl md:text-3xl lg:text-3xl",

                                        // clamp số dòng theo breakpoint (không còn height cố định)
                                        "line-clamp-3 sm:line-clamp-4 md:line-clamp-4 lg:line-clamp-5"
                                    )}
                                >
                                    {article.title}
                                </p>

                                {/* footer */}
                                <div className="pt-1">
                                    <ArticleFooter article={article} type={EArticleVariant.ARTICLE} isEdit={true} />
                                </div>

                                {/* author */}
                                <div className="flex items-center gap-2">
                                    <div className="flex flex-1 items-center gap-2 py-1.5 text-left text-sm">
                                        <AvatartImageCustom
                                            nameRouterPush={article.Users.username}
                                            className="h-8 w-8 rounded-full cursor-pointer"
                                            nameFallback={article.Users.name}
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
                            </div>

                            {/* Content  */}
                            <div className={cn("py-5 bg-background", "px-2")}>
                                <Editor isViewOnly initialContentJSON={article.content} />
                            </div>
                        </div>
                    </div>

                    <Separator className="visible lg:hidden" />

                    {/* right — chỉ sticky ở lg trở lên */}
                    <div className={cn("min-w-0 w-full")}>
                        <div className="lg:h-[calc(100dvh-var(--header-height)-64px)] flex flex-col lg:sticky top-4 sm:top-6 lg:top-8 lg:border-sidebar-border lg:border lg:shadow-sm rounded-lg overflow-hidden">
                            {/* comment header */}
                            <div
                                className={cn(
                                    "pb-2 md:p-2 md:pt-0 lg:p-2 space-y-5 lg:border-b lg:border-sidebar-border bg-[#f5f5f5] dark:bg-[#151515]"
                                )}
                            >
                                {/* comment title */}
                                <p className="text-xl font-bold">
                                    Comments <span className="text-sm text-muted-foreground">({article.ArticleCounters?.commentCount || 0})</span>
                                </p>
                                {/* comment input */}
                                <div>
                                    {info && (
                                        <CommentInput
                                            inputId="comment-input"
                                            article={article}
                                            setListComment={setListComment}
                                            commentParent={null}
                                        />
                                    )}
                                    {/* {info ? (
                                <CommentInput inputId="comment-input" article={article} setListComment={setListComment} commentParent={null} />
                            ) : (
                                <Button
                                    className={cn("!text-xs", "h-8 w-8", "sm:h-8 sm:w-20")}
                                    onClick={() => {
                                        router.push(ROUTER_CLIENT.LOGIN);
                                    }}
                                >
                                    <LogIn /> <span className={cn("hidden sm:inline font-bold")}>Login</span>
                                </Button>
                            )} */}
                                </div>
                            </div>

                            {/* comment list */}
                            <CommentList
                                article={article}
                                listComment={listComment}
                                setListComment={setListComment}
                                className={cn("py-2 px-0 md:px-2 flex-1 min-h-[500px]")}
                            />
                        </div>
                    </div>
                </div>

                {/* JSON-LD Article */}
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            </Container>
            {/* </ClickSpark> */}
        </div>
    );
}
