import { formatLocalTime } from "@/helpers/function.helper";
import { useAutoRelayout } from "@/hooks/auto-relayout";
import { TArticle } from "@/types/article.type";
import { MasonryInfiniteGrid } from "@egjs/react-infinitegrid";
import { useRouter } from "next/navigation";
import React from "react";
import ArticleFooter from "../article/article-footer/article-footer";
import AvatartImageCustom from "../custom/avatar-custom/avatart-custom";
import ExpandableText from "../expandable-text/ExpandableText";
import FacebookCollage from "../facebook-collage/facebook-collage";
import { generateStableId } from "../images-upload/images-upload";
import { Separator } from "../ui/separator";
import { ROUTER_CLIENT } from "@/constant/router.constant";
import { EArticleVariant } from "@/types/enum/article.enum";

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
            className="flex flex-col pt-2 gap-5 bg-card text-card-foreground rounded-xl border shadow-sm min-h-[0px] h-min w-full cursor-pointer"
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
            </div>

            {/* content */}
            {article.content && (
                <div className="px-2">
                    <ExpandableText
                        text={article.content}
                        placement="inline"
                        maxLines={5}
                        moreLabel="...more"
                        lessLabel="less"
                        fadeFromClass="from-[#fff] dark:from-[#171717]"
                        inlineButtonBgClass="bg-[#fff] dark:bg-[#171717]"
                        fadeHeightClass="h-full"
                    />
                </div>
            )}

            {/* images */}
            {article.imageUrls.length > 0 && (
                <div className="flex-1 px-2">
                    <FacebookCollage
                        items={
                            article.imageUrls.map((imageUrl) => ({
                                id: generateStableId(),
                                localBlobUrl: null,
                                serverUrl: imageUrl,
                                uploading: false,
                            })) || []
                        }
                    />
                </div>
            )}

            {/* footer */}
            <div className="px-2 mt-auto">
                <Separator />

                <div className="my-2">
                    <ArticleFooter article={article} type={EArticleVariant.POST} />
                </div>
            </div>
        </article>
    );
}
