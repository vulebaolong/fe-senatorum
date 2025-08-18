import { TArticle } from "./article.type";
import { TBaseTimestamps } from "./base.type";
import { TUser } from "./user.type";

export type TArticleVote = {
    id: string;
    articleId: TArticle["id"];
    userId: TUser["id"];
    value: 1 | -1;
} & TBaseTimestamps;

export type TArticleVoteReq = {
    articleId: TArticle["id"];
    value: 1 | -1;
};

export type TArticleUnVoteReq = {
    articleId: TArticle["id"];
};
