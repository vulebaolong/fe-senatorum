import ImageCustom from "@/components/custom/image-custom/ImageCustom";
import { OverflowBadges } from "@/components/overflow-badges/OverflowBadges";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY } from "@/constant/app.constant";
import { ROUTER_CLIENT } from "@/constant/router.constant";
import { formatLocalTime } from "@/helpers/function.helper";
import { TArticle } from "@/types/article.type";
import { useRouter } from "next/navigation";
import ArticleFooter from "../article-footer/article-footer";

type TProps = {
    article: TArticle;
};

export default function ArticleItem({ article }: TProps) {
    const router = useRouter();

    return (
        <article
            onClick={() => {
                router.push(`${ROUTER_CLIENT.ARTICLE}/${article.slug}`);
            }}
            className="pt-5 space-y-5 bg-card text-card-foreground rounded-xl border shadow-sm min-h-[384px] h-min w-full cursor-pointer"
        >
            {/* header */}
            <div className=" h-[40px] flex items-center justify-between px-5 ">
                <div className="flex basis-[60%] items-center gap-1 min-w-0">
                    <Avatar className="h-8 w-8 rounded-full">
                        <AvatarImage src={article.Users.avatar} alt={article.Users.name} />
                        <AvatarFallback className="rounded-full text-sm">{article.Users.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                        <p className="text-sm font-semibold truncate">{article.Users.name}</p>
                        <p className="text-xs text-muted-foreground">{formatLocalTime(article.createdAt, `ago`)}</p>
                    </div>
                </div>

                <div className="flex basis-[40%] items-center gap-1 h-full min-w-0 justify-end">
                    <p className="rounded-md border px-2 py-0.5 text-xs font-medium focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90 block truncate">
                        {article.Types.name}
                    </p>

                    {/* <Button variant="ghost" size="icon" className="size-6 ">
                        <Ellipsis className="text-muted-foreground" style={{ width: `15px`, height: `15px` }} />
                    </Button> */}
                </div>
            </div>

            {/* title */}
            <div className="leading-5 text-xl px-5 font-bold line-clamp-3 h-[60px]">{article.title}</div>

            {/* category */}
            <div className="px-2">
                <OverflowBadges
                    className="h-[22px]" // giữ chiều cao 1 dòng nếu muốn
                    gapPx={4} // khớp với gap-1
                    items={article.ArticleCategories.map((it) => it.Categories.name)}
                    // moreLabel={(n) => `+${n}`}                // có thể tuỳ biến
                />
            </div>

            {/* thumbnail */}
            <div className="flex-1 px-2 flex flex-col justify-between gap-2">
                <div className="w-full aspect-video border border-border rounded-lg overflow-hidden">
                    <ImageCustom src={`${NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY}${article.thumbnail}`} alt={"article image"} />
                </div>
            </div>

            {/* footer */}
            <div className="px-2 mt-auto">
                <Separator />

                <div className="my-2">
                    <ArticleFooter article={article} />
                </div>
            </div>
        </article>
    );
}
