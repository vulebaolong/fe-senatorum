import { FALLBACK_IMAGE, NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY } from "@/constant/app.constant";
import { ROUTER_CLIENT } from "@/constant/router.constant";
import { formatLocalTime } from "@/helpers/function.helper";
import { cn } from "@/lib/utils";
import { TArticle } from "@/types/article.type";
import { Clock4 } from "lucide-react";
import { useRouter } from "next/navigation";
import ArticleHeart from "../article/article-heart/article-heart";
import AvatartImageCustom from "../custom/avatar-custom/avatart-custom";
import ImageCustom from "../custom/image-custom/ImageCustom";

type TProps = {
    article: TArticle;
};

export default function GalleryImageItem1({ article }: TProps) {
    const router = useRouter();

    return (
        <div
            className="group relative w-full rounded-2xl overflow-hidden"
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
            <div
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
            </div>
        </div>
    );
}
