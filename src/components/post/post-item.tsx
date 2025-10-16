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
import { PostCarousel } from "./post-carousel";
import { Zap } from "lucide-react";

type TProps = {
    article: TArticle;
};

export default function PostItem({ article }: TProps) {
    const router = useRouter();

    return (
        <article
            onClick={() => {
                router.push(`${ROUTER_CLIENT.POST}/${article.slug}`);
            }}
            className="space-y-2 flex flex-col gap-0 bg-card text-card-foreground rounded-xl border shadow-sm min-h-[0px] h-min w-full cursor-pointer"
        >
            {/* header */}
            <div className="h-[40px] flex items-center justify-between px-2 pt-2">
                <div className="flex basis-[60%] items-center gap-1 min-w-0">
                    <AvatartImageCustom
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/${article.Users.username}`);
                        }}
                        className="h-8 w-8 rounded-full cursor-pointer"
                        name={article.Users.name}
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

                 <Zap size={15} className="text-blue-400" />
            </div>

            {/* content */}
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
            <div className="p-2 pt-0">
                <ArticleFooter article={article} type={EArticleVariant.POST} isEdit={false} />
            </div>
        </article>
    );
}
