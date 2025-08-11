import { TBaseTimestamps } from "./base.type";
import { TUser } from "./user.type";

export type TComment = {
    id: number;
    status: string;
    content: string;
    level: number;
    replyCount: number;
    parentId: number | null;
    articleId: number;
    userId: number;
    Users: TUser;
} & TBaseTimestamps;

export type TCreateCommentReq = {
    articleId: string;
    content: string;
    parentId: string | null;
};

export type TListComment = TComment & {
    children?: TListComment[];
};
