import { TArticleBookmark } from "./article-bookmark.type";
import { TArticleCategory } from "./article-category.type";
import { TBaseTimestamps } from "./base.type";
import { TReactionType } from "./reactioin.type";
import { TType } from "./type.type";
import { TUser } from "./user.type";

export type TArticle = {
    id: string;
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
    reaction: TReactionType | null;
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

export type TUpsertArticleReq = {
    title?: string;
    content?: string;
    thumbnail?: string;
    typeId?: string;
    categoryIds?: string[];
};
