import { TArticleBookmark } from "./article-bookmark.type";
import { TArticleCategory } from "./article-category.type";
import { TArticleCounter } from "./article-counter.type";
import { TArticleHeart } from "./article-heart.type";
import { TArticleVote } from "./article-vote.type";
import { TBaseTimestamps } from "./base.type";
import { EArticleStatus, EArticleVariant } from "./enum/article.enum";
import { TReactionType } from "./reactioin.type";
import { TType } from "./type.type";
import { TUser } from "./user.type";

export type TArticle = {
    id: string;
    status: EArticleStatus;
    slug: string;
    title: string;
    content: string;
    thumbnail: string;
    views: number;
    userId: string;
    typeId: string;
    Users: TUser;
    Types: TType;
    ArticleCategories: TArticleCategory[];
    ArticleBookmarks: TArticleBookmark[];
    ArticleHearts: TArticleHeart[];
    ArticleVotes: TArticleVote[];
    ArticleCounters: TArticleCounter | null;
    reaction: TReactionType | null;
    publishedAt: string | null;
    variant: EArticleVariant
    imageUrls: string[]
} & TBaseTimestamps;

export type TCreateArticleReq = {
    title: string;
    content: string;
    thumbnail: string;
    typeId: string;
    categoryIds: string[];
};

export type TPublishArticleReq = {
    title: string;
};

export type TUpsertArticleDarftReq = {
    title?: string;
    content?: string;
    thumbnail?: string;
    typeId?: string;
    categoryIds?: string[];
};

export type TUpsertArticleEditReq = {
    id: TArticle["id"];
    title?: string;
    content?: string;
    thumbnail?: string;
    typeId?: string;
    categoryIds?: string[];
};

export type TDeleteArticleReq = {
    id: TArticle["id"];
};

export type TUpdateArticleReq = {
    id: TArticle["id"];
    formData: FormData;
};
