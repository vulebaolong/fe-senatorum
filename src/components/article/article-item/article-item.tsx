import ButtonIcon from "@/components/custom/button-custom/button-icon";
import ImageCustom from "@/components/custom/image-custom/ImageCustom";
import IconArrowDown from "@/components/icon/icon-arrow-down";
import IconArrowUp from "@/components/icon/icon-arrow-up";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ROUTER_CLIENT } from "@/constant/router.constant";
import { formatLocalTime } from "@/helpers/function.helper";
import useRouter from "@/hooks/use-router-custom";
import { TArticle } from "@/types/article.type";
import { Bookmark, Ellipsis, Eye, MessageCircle, Share2 } from "lucide-react";

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
            className="pt-5 space-y-5 bg-card text-card-foreground rounded-xl border shadow-sm min-h-[384px] h-full w-full cursor-pointer"
        >
            {/* header */}
            <div className=" h-[40px] flex items-center justify-between px-5 ">
                <div className="flex basis-[60%] items-center gap-1 min-w-0">
                    <Avatar className="h-6 w-6 rounded-full">
                        <AvatarImage src={article.Users.avatar} alt={article.Users.nickName} />
                        <AvatarFallback className="rounded-full text-xs">{article.Users.nickName.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-8 w-8 rounded-full">
                        <AvatarImage src={article.Users.avatar} alt={article.Users.nickName} />
                        <AvatarFallback className="rounded-full text-sm">{article.Users.nickName.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                        <p className="text-sm font-semibold truncate">{article.Users.nickName}</p>
                        <p className="text-xs text-muted-foreground">{formatLocalTime(article.createdAt, `ago`)}</p>
                    </div>
                </div>

                <div className="flex basis-[40%] items-center gap-1 h-full min-w-0 justify-end">
                    <p className="rounded-md border px-2 py-0.5 text-xs font-medium focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90 block truncate">
                        {article.Types.name}
                    </p>

                    <Button variant="ghost" size="icon" className="size-6 ">
                        <Ellipsis className="text-muted-foreground" style={{ width: `15px`, height: `15px` }} />
                    </Button>
                </div>
            </div>

            {/* title */}
            <div className="leading-5 text-xl px-5 font-bold line-clamp-3 h-[60px]">{article.title}</div>

            {/* category */}
            <div className="flex flex-col gap-2 px-5 h-[22px]">
                <div className="flex items-center gap-1 flex-wrap">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Badge key={i} variant="outline">
                            Outline
                        </Badge>
                    ))}
                </div>
            </div>

            {/* thumbnail */}
            <div className="flex-1 px-2 flex flex-col justify-between gap-2">
                <div className="w-full aspect-video border border-border rounded-lg overflow-hidden">
                    <ImageCustom src={article.thumbnail} alt={"article image"} />
                </div>
            </div>

            {/* footer */}
            <div className="px-2 mt-auto">
                <Separator />

                <div className="flex items-center justify-between w-full my-2">
                    <div className="flex-1">
                        <div className="flex items-center w-min gap-1 p-0.5 rounded-lg border border-border-subtlest-tertiary">
                            <ButtonIcon variant="ghost" size="icon" className="size-6">
                                <IconArrowUp className="w-6 h-6 pointer-events-none" />
                            </ButtonIcon>
                            <p className="text-sm font-semibold">{50}</p>
                            <ButtonIcon variant="ghost" size="icon" className="size-6 ">
                                <IconArrowDown className="w-6 h-6 pointer-events-none" />
                            </ButtonIcon>
                        </div>
                    </div>
                    <div className="flex flex-1 items-center gap-1 justify-center">
                        <Eye className="text-muted-foreground" size={12} />
                        <p className="text-xs font-semibold text-muted-foreground">2.1k</p>
                        <MessageCircle className="text-muted-foreground" size={12} />
                        <p className="text-xs font-semibold text-muted-foreground">47</p>
                    </div>
                    <div className="flex flex-1 items-center gap-1 justify-end">
                        <ButtonIcon variant="ghost" size="icon" className="size-6">
                            <Bookmark style={{ width: `15px`, height: `15px` }} />
                        </ButtonIcon>
                        <ButtonIcon variant="ghost" size="icon" className="size-6">
                            <Share2 style={{ width: `15px`, height: `15px` }} />
                        </ButtonIcon>
                    </div>
                </div>
            </div>
        </article>
    );
}
