import { TBaseTimestamps } from "./base.type";
import { ChapterStatus } from "./enum/chapter.enum";
import { TUser } from "./user.type";

export type TChapter = {
    id: string;
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
