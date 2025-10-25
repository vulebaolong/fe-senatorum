import Articlelist from "@/components/article/article-list/article-list";
import ArticlelistGrid from "@/components/article/article-list/article-list-grid";
import { EArticleVariant } from "@/types/enum/article.enum";

export default function Page() {
    return <ArticlelistGrid type="all" filters={{ variant: EArticleVariant.ARTICLE }} />;
}
