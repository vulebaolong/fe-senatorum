import { FALLBACK_IMAGE, NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY } from "@/constant/app.constant";
import { ROUTER_CLIENT } from "@/constant/router.constant";
import { formatCompactIntl, formatLocalTime } from "@/helpers/function.helper";
import { cn } from "@/lib/utils";
import { TArticle } from "@/types/article.type";
import { Clock4, Eye, MessageSquare, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import ArticleHeart from "../article/article-heart/article-heart";
import AvatartImageCustom from "../custom/avatar-custom/avatart-custom";
import ImageCustom from "../custom/image-custom/ImageCustom";
import { useState } from "react";
import { Button } from "../ui/button";
import ArticleShare from "../article/article-share/article-share";
import ArticleBookmark from "../article/article-bookmark/article-bookmark";

type TProps = {
    article: TArticle;
};

export default function GalleryImageItem1({ article }: TProps) {
    const router = useRouter();
    // const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="group relative w-full rounded-2xl overflow-hidden"
            // onMouseEnter={() => setIsHovered(true)}
            // onMouseLeave={() => setIsHovered(false)}
            onClick={() => {
                router.push(`${ROUTER_CLIENT.GALLERY_IMAGE}/${article.slug}`);
            }}
        >
            {/* Ảnh */}
            <ImageCustom
                src={!article.thumbnail ? FALLBACK_IMAGE : `${NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY}/${article.thumbnail}`}
                alt="article image"
                imageFor="list"
                // className="transition-transform duration-500 group-hover:scale-101" // zoom nhẹ
            />

            {/* Lớp phủ */}
            {/* <div
                className={cn(
                    "absolute inset-0 bg-gradient-to-b from-black/70",
                    "opacity-0 group-hover:opacity-100 ",
                    "to-transparent transition-opacity duration-200 group-hover:opacity-100 opacity-0",
                    "flex flex-col justify-between p-2"
                )}
            >
                <div className="flex items-center justify-between">
                    <div className="flex flex-1 items-center gap-2 text-left text-sm">
                        <AvatartImageCustom
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/${article.Users.username}`);
                            }}
                            className="h-6 w-6 rounded-full cursor-pointer"
                            nameFallback={article.Users.name}
                            nameRouterPush={article.Users.username}
                            src={article.Users.avatar}
                        />
                        <div className="grid flex-1 text-left leading-tight text-white">
                            <span
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/${article.Users.username}`);
                                }}
                                className="truncate font-medium hover:underline cursor-pointer w-fit text-[11px]"
                            >
                                {article.Users.name}
                            </span>
                            <div className="inline-flex items-center gap-1 text-gray-400  text-[8px] font-medium ">
                                <Clock4 size={8} />
                                {formatLocalTime(article.publishedAt)}
                            </div>
                        </div>
                    </div>
                    <ArticleHeart
                        // variant={"default"}
                        articleId={article.id}
                        heartCountInit={article.ArticleCounters?.heartCount || 0}
                        initial={article.ArticleHearts.length > 0}
                    />
                </div>

                <div className="flex items-center justify-between text-white">
                    <div className="text-sm font-bold truncate">{article.title}</div>
                    <div className=""></div>
                </div>
            </div> */}

            {/* Hover Overlay - Desktop only */}
            <div
                className={cn(
                    // "absolute inset-0 bg-gradient-to-b from-black/70",
                    "absolute inset-0  bg-black/50",
                    "opacity-0 group-hover:opacity-100 ",
                    "duration-200 group-hover:opacity-100 opacity-0"
                )}
            >
                {/* Top Actions */}
                <div
                    className={cn(
                        "absolute top-0 left-0 right-0 p-2 sm:p-3 flex items-center justify-between transition-all duration-300",
                        "-translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                    )}
                >
                    {/* Author Info */}
                    <div className="p-0.5 pr-1.5 rounded-full flex items-center gap-2 text-left text-sm bg-accent dark:bg-accent/50 w-min">
                        <AvatartImageCustom
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/${article.Users.username}`);
                            }}
                            className="h-5 w-5 rounded-full cursor-pointer"
                            nameFallback={article.Users.name}
                            nameRouterPush={article.Users.username}
                            src={article.Users.avatar}
                        />
                        <div className="grid flex-1 text-left leading-tight ">
                            <span
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/${article.Users.username}`);
                                }}
                                className="truncate font-medium hover:underline cursor-pointer w-fit text-[11px]"
                            >
                                {article.Users.name}
                            </span>
                            <div className="inline-flex items-center gap-0.5 text-gray-400 text-[8px] font-medium ">
                                <Clock4 size={8} />
                                <span className="w-max">{formatLocalTime(article.publishedAt)}</span>
                            </div>
                        </div>
                    </div>

                    {/* More Button */}
                    {/* <Button
                        size="icon"
                        className="h-6 px-[5px] rounded-lg w-auto"
                        variant={"outline"}
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log("More options");
                        }}
                    >
                        <MoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Button> */}
                </div>

                {/* Bottom Actions */}
                <div
                    className={cn(
                        "absolute bottom-0 left-0 right-0 p-2 sm:p-4 transition-all duration-300 ",
                        "translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                    )}
                >
                    {/* Title */}
                    <h3 className="text-white font-semibold text-xs sm:text-base mb-2line-clamp-2 drop-shadow-lg">{article.title}</h3>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                        {/* Left Actions */}
                        <div className="flex items-center space-x-0.5 sm:space-x-1">
                            {/* heart */}
                            <ArticleHeart
                                variant={"outline"}
                                articleId={article.id}
                                heartCountInit={article.ArticleCounters?.heartCount || 0}
                                initial={article.ArticleHearts.length > 0}
                            />

                            {/* Comment - Hidden on very small mobile */}
                            <Button size="icon" className="hidden sm:flex h-6 px-[5px] rounded-lg w-auto" variant={"outline"}>
                                <div className="flex items-center gap-1 justify-center">
                                    <MessageSquare className="text-muted-foreground" />
                                    {(article.ArticleCounters?.commentCount || 0) > 0 && (
                                        <p className="text-xs font-semibold text-muted-foreground">
                                            {formatCompactIntl(article.ArticleCounters?.commentCount)}
                                        </p>
                                    )}
                                </div>
                            </Button>

                            {/* Views - Hidden on mobile */}
                            <Button size="icon" className="hidden sm:flex h-6 px-[5px] rounded-lg w-auto" variant={"outline"}>
                                <div className="flex items-center gap-1 justify-center">
                                    <Eye className="text-muted-foreground" />
                                    {(article.ArticleCounters?.viewCount || 0) > 0 && (
                                        <p className="text-xs font-semibold text-muted-foreground">
                                            {formatCompactIntl(article.ArticleCounters?.viewCount)}
                                        </p>
                                    )}
                                </div>
                            </Button>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center space-x-0.5 sm:space-x-1">
                            {/* Share */}
                            {/* <ArticleShare article={article} variant={"outline"} /> */}
                            <ArticleBookmark articleId={article.id} initial={article.ArticleBookmarks.length > 0} variant={"outline"}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
