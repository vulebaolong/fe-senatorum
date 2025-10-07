import AvatartImageCustom from "@/components/custom/avatar-custom/avatart-custom";
import ImageCustom from "@/components/custom/image-custom/ImageCustom";
import { OverflowBadges } from "@/components/overflow-badges/OverflowBadges";
import { Separator } from "@/components/ui/separator";
import { FALLBACK_IMAGE, NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY } from "@/constant/app.constant";
import { ROUTER_CLIENT } from "@/constant/router.constant";
import { formatLocalTime } from "@/helpers/function.helper";
import { TArticle } from "@/types/article.type";
import { useRouter } from "next/navigation";
import ArticleFooter from "../article-footer/article-footer";
import ArticleType from "../article-type/article-type";
import ClickSpark from "@/components/ClickSpark";
import { EArticleVariant } from "@/types/enum/article.enum";

type TProps = {
    article: TArticle;
};

export default function ArticleItem({ article }: TProps) {
    const router = useRouter();

    return (
        <ClickSpark sparkColor="#fff" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
            <article
                onClick={() => {
                    router.push(`${ROUTER_CLIENT.ARTICLE}/${article.slug}`);
                }}
                className="flex flex-col pt-2 gap-5 bg-card text-card-foreground rounded-xl border shadow-sm min-h-[384px] h-min w-full cursor-pointer"
            >
                {/* header */}
                <div className="h-[40px] flex items-center justify-between px-2">
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

                    <ArticleType type={article.Types} />
                </div>

                {/* title */}
                <div className="leading-6 text-xl px-2 font-bold line-clamp-2 h-[50px] break-words">{article.title}</div>

                {/* category */}
                <div className="px-2">
                    <OverflowBadges
                        className="h-[22px]"
                        gapPx={4}
                        items={article.ArticleCategories.map((it) => `#${it.Categories.name}`)}
                        variant={"outline"}
                    />
                </div>

                {/* thumbnail */}
                <div className="flex-1 px-2 flex flex-col justify-between gap-2">
                    <div className="w-full aspect-video border border-border rounded-lg overflow-hidden">
                        <ImageCustom
                            src={!article.thumbnail ? FALLBACK_IMAGE : `${NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY}/${article.thumbnail}`}
                            alt={"article image"}
                        />
                    </div>
                </div>

                {/* footer */}
                <div className="px-2 mt-auto">
                    <Separator />

                    <div className="my-2">
                        <ArticleFooter article={article} type={EArticleVariant.ARTICLE} />
                    </div>
                </div>
            </article>
        </ClickSpark>
    );
}
