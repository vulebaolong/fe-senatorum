import { TArticle } from "@/types/article.type";
import ArticleVote from "../article-vote/article-vote";
import { Eye, MessageCircle, Share2 } from "lucide-react";
import ArticleBookmark from "../article-bookmark/article-bookmark";
import ButtonIcon from "@/components/custom/button-custom/button-icon";
import { formatCompactIntl } from "@/helpers/function.helper";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import FacebookIcon from "../article-detail/icon-social/facebook-icon";
import XIcon from "../article-detail/icon-social/x-icon";
import InstagramIcon from "../article-detail/icon-social/instagram-icon";
import RedditIcon from "../article-detail/icon-social/reddit-icon";

type TProps = {
    article: TArticle;
};

export default function ArticleFooter({ article }: TProps) {
    return (
        <div className="flex items-center justify-between w-full">
            <ArticleVote
                articleId={article.id}
                initialScore={article.ArticleCounters?.voteCount || 0} // tổng điểm hiện tại
                initialMyVote={article.ArticleVotes[0]?.value || 0} // -1 | 0 | 1
                onChange={({ score, myVote }) => {
                    // (tùy chọn) cập nhật UI ở parent hoặc analytics
                }}
            />

            <div className="flex  items-center gap-1 justify-center">
                <Eye className="text-muted-foreground" size={12} />
                <p className="text-xs font-semibold text-muted-foreground">{formatCompactIntl(article.ArticleCounters?.viewCount || 0)}</p>
            </div>

            <div className="flex  items-center gap-1 justify-center">
                <MessageCircle className="text-muted-foreground" size={12} />
                <p className="text-xs font-semibold text-muted-foreground">{formatCompactIntl(article.ArticleCounters?.commentCount || 0)}</p>
            </div>

            <ArticleBookmark articleId={article.id} initial={article.ArticleBookmarks.length > 0} />

            <Popover>
                <PopoverTrigger>
                    <ButtonIcon variant="ghost" size="icon" className="size-6">
                        <Share2 style={{ width: `15px`, height: `15px` }} />
                    </ButtonIcon>
                </PopoverTrigger>
                <PopoverContent data-side="right" className="flex gap-2 h-[50px] w-fit p-1">
                    <FacebookIcon />
                    <XIcon />
                    <InstagramIcon />
                    <RedditIcon />
                </PopoverContent>
            </Popover>
        </div>
    );
}
