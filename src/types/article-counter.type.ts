import { TArticle } from "./article.type";
import { TBaseTimestamps } from "./base.type";

export type TArticleCounter = {
    id: string;
    articleId: TArticle["id"];
    commentCount: number;
    viewCount: number;
    voteCount: number;
    bookmarkCount: number;
} & TBaseTimestamps;
