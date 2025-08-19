import { getDetailArticleAction } from "@/api/actions/article.action";
import ArticleDetail from "@/components/article/article-detail/article-detail";

type TProps = {
    params: Promise<{ slug: string }>;
};

export default async function Page({ params }: TProps) {
    const { slug } = await params;
    const dataDetailArticle = await getDetailArticleAction(slug);

    return <ArticleDetail dataDetailArticle={dataDetailArticle} />;
}
