import { TArticle } from "./article.type";
import { TBaseTimestamps } from "./base.type";
import { ECommentStatus } from "./enum/comment-status.enum";
import { TRole } from "./role.type";
import { TUser } from "./user.type";

export type TComment = {
    id: string;
    status: ECommentStatus;
    content: string;
    level: number;
    replyCount: number;
    parentId: TComment["id"] | null;
    articleId: TArticle["id"];
    userId: TUser["id"];
    Users: TUser;
} & TBaseTimestamps;

export type TCreateCommentReq = {
    articleId: TArticle["id"];
    content: string;
    parentId: TComment["id"] | null;
    authorArticleId: TUser["id"];
};

export type TListComment = {
    id: string;
    status: ECommentStatus;
    content: string;
    level: number;
    replyCount: number;
    parentId: TComment["id"] | null;
    articleId: TArticle["id"];
    userId: TUser["id"];
    createdAt?: string;
    updatedAt?: string;
    isDeleted?: boolean;
    Users: {
        id: string;
        email: string;
        name: string;
        username: string;
        avatar?: string;
        googleId?: string;
        roleId: TRole["id"];
        isTotp: boolean;
        createdAt?: string;
        updatedAt?: string;
        isDeleted?: boolean;
    };
    children?: TListComment[];
};

export type TJoinRoomCommentReq = {
    articleId: TArticle["id"];
};

export type TRoomCommentRes = {
    authorIdComment: TUser["id"];
    parentId: TComment["id"] | null;
    level: number;
};

export type TUpdateComment = {
    id: TComment["id"];
    content: TComment["content"];

};
export type TDeleteComment = {
    id: TComment["id"];
};
