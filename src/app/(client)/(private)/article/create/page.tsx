import { getDraftArticleAction } from "@/api/actions/article.action";
import { getListCategoryArticleAction } from "@/api/actions/category.action";
import { getListTypeArticleAction } from "@/api/actions/type.action";
import ArticleCreate from "@/components/article/article-create/article-create";
import ResponsivePostCard from "@/components/post/upgraded-post-card";

export default async function Page() {
    const [dataArticleDaft, dataListTypeArticle, dataListCategoryArticle] = await Promise.all([
        getDraftArticleAction(),
        getListTypeArticleAction(),
        getListCategoryArticleAction(),
    ]);

    return (
        <ArticleCreate
            type="create"
            dataArticle={dataArticleDaft}
            dataListTypeArticle={dataListTypeArticle}
            dataListCategoryArticle={dataListCategoryArticle}
        />
    );
}
