import { ArticleBookmark } from "./article-bookmark.type";
import { TArticleCategory } from "./article-category.type";
import { TBaseTimestamps } from "./base.type";
import { ChapterStatus } from "./enum/chapter.enum";
import { TReactionType } from "./reactioin.type";
import { TType } from "./type.type";
import { TUser } from "./user.type";

export type TChapter = {
    id: number;
    status: ChapterStatus;
    userId: number;
    name: string;
    slug: string;
    description: string;
    banner: string;
    avatar: string;
    isApprovalRequired: boolean;
    Users: TUser;
} & TBaseTimestamps;

export type TPublishChapterReq = {
    name: string;
};

export type TUpsertChapterReq = {
    name?: string;
    description?: string;
    banner?: string;
    avatar?: string;
    isApprovalRequired?: boolean;
};
