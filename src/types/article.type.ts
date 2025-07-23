import { TBaseTimestamps } from "./base.type";
import { TReactionType } from "./reactioin.type";
import { TType } from "./type.typ";
import { TUser } from "./user.type";

export type TArticle = {
    id: number;
    slug: string;
    title: string;
    content: any;
    thumbnail: string;
    views: number;
    userId: number;
    typeId: number;
    Users: TUser;
    Types: TType;
    reaction: TReactionType | null;
} & TBaseTimestamps;
