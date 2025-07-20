import { TBaseTimestamps } from "./base.type";
import { TReactionType } from "./reactioin.type";
import { TType } from "./type.typ";
import { TUser } from "./user.type";

export type TArticle = {
    id: number;
    title: string;
    content: any;
    imageUrl: string;
    views: number;
    userId: number;
    typeId: number;
    Users: TUser;
    Types: TType;
    reaction: TReactionType | null;
} & TBaseTimestamps;
