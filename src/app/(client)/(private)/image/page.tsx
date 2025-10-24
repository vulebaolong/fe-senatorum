import ArticlelistMasony from "@/components/article/article-list/article-list-masony-3";
import { EArticleVariant } from "@/types/enum/article.enum";

export default function Page() {
    return <ArticlelistMasony type="all" filters={{ variant: EArticleVariant.IMAGE }} />;
}
