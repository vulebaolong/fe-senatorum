import { ROUTER_CLIENT } from "@/constant/router.constant";
import { formatLocalTime } from "@/helpers/function.helper";
import { cn } from "@/lib/utils";
import { TArticle } from "@/types/article.type";
import { EArticleVariant } from "@/types/enum/article.enum";
import { useRouter } from "next/navigation";
import ArticleFooter from "../article/article-footer/article-footer";
import AvatartImageCustom from "../custom/avatar-custom/avatart-custom";
import ExpandableText from "../expandable-text/ExpandableText";
import { Separator } from "../ui/separator";
import { Image, Zap } from "lucide-react";
import ImageCustom from "../custom/image-custom/ImageCustom";
import { FALLBACK_IMAGE, NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY } from "@/constant/app.constant";

type TProps = {
    article: TArticle;
};

export default function GalleryImageItem({ article }: TProps) {
    const router = useRouter();

    return (
        <article
            onClick={() => {
                router.push(`${ROUTER_CLIENT.GALLERY_IMAGE}/${article.slug}`);
            }}
            className="space-y-2 flex flex-col gap-0 bg-card text-card-foreground rounded-xl border shadow-sm min-h-[0px] h-min w-full cursor-pointer"
        >
            {/* header */}
            <div className="h-[40px] flex items-center justify-between px-2 pt-2">
                <div className="flex basis-[60%] items-center gap-1 min-w-0">
                    <AvatartImageCustom
                        className="h-8 w-8 rounded-full cursor-pointer"
                        nameFallback={article.Users.name}
                        nameRouterPush={article.Users.username}
                        src={article.Users.avatar}
                    />
                    <div className="flex flex-col min-w-0">
                        <p
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/${article.Users.username}`);
                            }}
                            className="text-sm font-semibold truncate hover:underline"
                        >
                            {article.Users.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatLocalTime(article.publishedAt, `ago`)}</p>
                    </div>
                </div>

                <Image size={15} className="text-blue-400" />
            </div>

            {/* title */}
            <div className=" px-2 text-sm font-bold truncate">{article.title}</div>

            {/* thumbnail */}
            <div className="flex-1 px-2 flex flex-col justify-between gap-2">
                <div className="w-full aspect-video border border-border rounded-lg overflow-hidden">
                    <ImageCustom
                        src={!article.thumbnail ? FALLBACK_IMAGE : `${NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY}/${article.thumbnail}`}
                        alt={"article image"}
                        imageFor="list"
                    />
                </div>
            </div>

            <div className="px-2">
                <Separator />
            </div>

            {/* footer */}
            <div className="p-2 pt-0">
                <ArticleFooter article={article} type={EArticleVariant.POST} isEdit={false} />
            </div>
        </article>
    );
}
