import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { NEXT_PUBLIC_BASE_DOMAIN_FE } from "@/constant/app.constant";
import { formatCompactIntl } from "@/helpers/function.helper";
import { TArticle } from "@/types/article.type";
import { Eye, LinkIcon, MessageSquare, Share2 } from "lucide-react";
import ArticleBookmark from "../article-bookmark/article-bookmark";
import FacebookIcon from "../article-detail/icon-social/facebook-icon";
import LinkedInIcon from "../article-detail/icon-social/linked-in-icon";
import RedditIcon from "../article-detail/icon-social/reddit-icon";
import XIcon from "../article-detail/icon-social/x-icon";
import ArticleHeart from "../article-heart/article-heart";
import { useAppSelector } from "@/redux/store";
import ArticleDetailAction from "../article-detail/article-detail-action";

const buildAbsoluteUrl = (path: string) => new URL(path, NEXT_PUBLIC_BASE_DOMAIN_FE!).toString();

const enc = (v: string) => encodeURIComponent(v);

type TProps = {
    article: TArticle;
};

export default function ArticleFooter({ article }: TProps) {
    const info = useAppSelector((state) => state.user.info);

    const url = buildAbsoluteUrl(`/article/${article.slug}`);
    // const url = `https://tabbicus.com/article/airbus-h175m-helicopter-detailed-overview`
    const u = enc(url);
    const t = enc(article.title);

    const links = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
        x: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
        reddit: `https://www.reddit.com/submit?url=${u}&title=${t}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
        whatsapp: `https://api.whatsapp.com/send?text=${t}%20${u}`,
        telegram: `https://t.me/share/url?url=${u}&text=${t}`,
        // Instagram: không có endpoint share qua URL
    };

    const copyLink = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await navigator.clipboard.writeText(url);
        // Ví dụ: dùng toast ở đây
        // toast.success("Đã copy link");
    };

    const nativeShare = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (navigator.share) {
            try {
                await navigator.share({ title: article.title, text: article.title, url });
            } catch {}
        } else {
            await copyLink(e);
        }
    };

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
                    <p className="text-xs font-semibold text-muted-foreground">{formatCompactIntl(article.ArticleCounters?.viewCount || 0)}</p>
                </div>
            </Button>

            <Button size="icon" className="h-6 px-[5px] rounded-lg w-auto" variant={"ghost"}>
                <div className="flex items-center gap-1 justify-center">
                    <MessageSquare className="text-muted-foreground" />
                    <p className="text-xs font-semibold text-muted-foreground">{formatCompactIntl(article.ArticleCounters?.commentCount || 0)}</p>
                </div>
            </Button>

            <ArticleBookmark articleId={article.id} initial={article.ArticleBookmarks.length > 0} />

            <Popover>
                <PopoverTrigger asChild onPointerDownCapture={(e) => e.stopPropagation()}>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Chia sẻ"
                        data-no-card-click
                    >
                        <Share2 className="text-muted-foreground" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent data-side="right" className="flex gap-2 h-[50px] w-fit p-1" onPointerDownCapture={(e) => e.stopPropagation()}>
                    <a
                        href={links.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Chia sẻ Facebook"
                        className="size-10"
                    >
                        <FacebookIcon />
                    </a>

                    <a
                        href={links.x}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Chia sẻ X"
                        className="size-10"
                    >
                        <XIcon />
                    </a>

                    {/* <InstagramIcon /> */}

                    <a
                        href={links.reddit}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Chia sẻ Reddit"
                        className="size-10"
                    >
                        <RedditIcon />
                    </a>

                    <a
                        href={links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Chia sẻ LinkedIn"
                        className="size-10"
                    >
                        <LinkedInIcon />
                    </a>

                    <Button variant="ghost" size="icon" className="size-10" onClick={copyLink} aria-label="Copy link">
                        <LinkIcon />
                    </Button>
                </PopoverContent>
            </Popover>

            {info?.id === article.Users.id && <ArticleDetailAction detailArticle={article} />}
        </div>
    );
}
