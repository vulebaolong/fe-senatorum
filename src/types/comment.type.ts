import { TBaseTimestamps } from "./base.type";
import { ECommentStatus } from "./enum/comment-status.enum";
import { TUser } from "./user.type";

export type TComment = {
    id: number;
    status: ECommentStatus;
    content: string;
    level: number;
    replyCount: number;
    parentId: number | null;
    articleId: number;
    userId: number;
    Users: TUser;
} & TBaseTimestamps;

export type TCreateCommentReq = {
    articleId: number;
    content: string;
    parentId: number | null;
};

export type TListComment = {
    id: number;
    status: ECommentStatus;
    content: string;
    level: number;
    replyCount: number;
    parentId: number | null;
    articleId: number;
    userId: number;
    createdAt?: string;
    updatedAt?: string;
    isDeleted?: boolean;
    Users: {
        id: number;
        email: string;
        name: string;
        username: string;
        avatar?: string;
        googleId?: string;
        roleId: string;
        isTotp: boolean;
        createdAt?: string;
        updatedAt?: string;
        isDeleted?: boolean;
    };
    children?: TListComment[];
};
