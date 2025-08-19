import { getDetailArticleAction } from "@/api/actions/article.action";
import { getListCategoryArticleAction } from "@/api/actions/category.action";
import { getListTypeArticleAction } from "@/api/actions/type.action";
import ArticleCreate from "@/components/article/article-create/article-create";

type TProps = {
    params: Promise<{ slug: string }>;
};

export default async function Page({ params }: TProps) {
    const { slug } = await params;

    const [dataArticleDetail, dataListTypeArticle, dataListCategoryArticle] = await Promise.all([
        getDetailArticleAction(slug),
        getListTypeArticleAction(),
        getListCategoryArticleAction(),
    ]);

    return (
        <ArticleCreate
            type="edit"
            dataArticle={dataArticleDetail}
            dataListTypeArticle={dataListTypeArticle}
            dataListCategoryArticle={dataListCategoryArticle}
        />
    );
}
