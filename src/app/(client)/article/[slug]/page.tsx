import ArticleDetail from "@/components/article/article-detail/article-detail";

type TProps = {
    params: Promise<{ slug: string }>;
};

export default async function Page({ params }: TProps) {
    const { slug } = await params;
    return <ArticleDetail slug={slug} />;
}
