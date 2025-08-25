import { TArticle } from "./article.type";
import { TBaseTimestamps } from "./base.type";
import { TFollow } from "./follow.type";
import { TUser } from "./user.type";

export type TNotification = {
    id: string;
    recipientId: string;
    type: string;
    actorId: TUser["id"];
    articleId: TArticle["id"] | null;
    followId: TFollow["id"] | null;
    isRead: boolean;
    readAt: string | null;
    Users_Notifications_actorIdToUsers: TUser;
} & TBaseTimestamps;
