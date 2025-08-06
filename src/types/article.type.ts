import { TArticleCategory } from "./article-category.type";
import { TBaseTimestamps } from "./base.type";
import { TReactionType } from "./reactioin.type";
import { TType } from "./type.type";
import { TUser } from "./user.type";

export type TArticle = {
    id: number;
    slug: string;
    title: string;
    content: string;
    thumbnail: string;
    views: number;
    userId: number;
    typeId: number;
    Users: TUser;
    Types: TType;
    ArticleCategories: TArticleCategory[];
    reaction: TReactionType | null;
} & TBaseTimestamps;

export type TCreateArticleReq = {
    title: string;
    content: string;
    thumbnail: string;
    typeId: number;
    categoryIds: number[];
};
