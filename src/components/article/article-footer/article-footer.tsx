import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { NEXT_PUBLIC_BASE_DOMAIN_FE } from "@/constant/app.constant";
import { formatCompactIntl } from "@/helpers/function.helper";
import { useAppSelector } from "@/redux/store";
import { TArticle } from "@/types/article.type";
import { EArticleVariant } from "@/types/enum/article.enum";
import { Eye, LinkIcon, MessageSquare, Share2 } from "lucide-react";
import ArticleBookmark from "../article-bookmark/article-bookmark";
import ArticleDetailAction from "../article-detail/article-detail-action";
import FacebookIcon from "../article-detail/icon-social/facebook-icon";
import LinkedInIcon from "../article-detail/icon-social/linked-in-icon";
import RedditIcon from "../article-detail/icon-social/reddit-icon";
import XIcon from "../article-detail/icon-social/x-icon";
import ArticleHeart from "../article-heart/article-heart";
import ArticleShare from "../article-share/article-share";

type TProps = {
    article: TArticle;
    type: EArticleVariant;
    isEdit: boolean;
};

export default function ArticleFooter({ article, type, isEdit }: TProps) {
    const info = useAppSelector((state) => state.user.info);

    return (
        <div className="flex items-center justify-between w-full">
            {/* <ArticleVote
                articleId={article.id}
                initialScore={article.ArticleCounters?.voteCount || 0} // tổng điểm hiện tại
                initialMyVote={article.ArticleVotes[0]?.value || 0} // -1 | 0 | 1
                onChange={({ score, myVote }) => {
                    // (tùy chọn) cập nhật UI ở parent hoặc analytics
                }}
            /> */}

            <ArticleHeart
                articleId={article.id}
                heartCountInit={article.ArticleCounters?.heartCount || 0}
                initial={article.ArticleHearts.length > 0}
            />

            <Button size="icon" className="h-6 px-[5px] rounded-lg w-auto" variant={"ghost"}>
                <div className="flex items-center gap-1 justify-center">
                    <Eye className="text-muted-foreground" />
                    {(article.ArticleCounters?.viewCount || 0) > 0 && (
                        <p className="text-xs font-semibold text-muted-foreground">{formatCompactIntl(article.ArticleCounters?.viewCount)}</p>
                    )}
                </div>
            </Button>

            <Button size="icon" className="h-6 px-[5px] rounded-lg w-auto" variant={"ghost"}>
                <div className="flex items-center gap-1 justify-center">
                    <MessageSquare className="text-muted-foreground" />
                    {(article.ArticleCounters?.commentCount || 0) > 0 && (
                        <p className="text-xs font-semibold text-muted-foreground">{formatCompactIntl(article.ArticleCounters?.commentCount)}</p>
                    )}
                </div>
            </Button>

            <ArticleBookmark articleId={article.id} initial={article.ArticleBookmarks.length > 0} />

            <ArticleShare article={article} />

            {isEdit && info?.id === article.Users.id && <ArticleDetailAction detailArticle={article} type={type} />}
        </div>
    );
}
