import { getDetailArticleAction } from "@/api/actions/article.action";
import { getIsFollowingAction } from "@/api/actions/follow.action";
import ArticleDetail from "@/components/article/article-detail/article-detail";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { NEXT_PUBLIC_BASE_DOMAIN_FE } from "@/constant/app.constant";
import { CircleX } from "lucide-react";

import type { Metadata } from "next";

type TProps = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: TProps): Promise<Metadata> {
    const { slug } = await params;
    const { data: article } = await getDetailArticleAction(slug);

    if (!article) return {};

    const url = `${NEXT_PUBLIC_BASE_DOMAIN_FE}/article/${article.slug}`;
    const title = article.title;
    const desc = article.title;
    const ogImage = article.thumbnail ? `${NEXT_PUBLIC_BASE_DOMAIN_FE}/${article.thumbnail}` : `${NEXT_PUBLIC_BASE_DOMAIN_FE}/og-default.jpg`;

    return {
        title, // sẽ áp dụng template ở Root: "%s | TITLE"
        description: desc,
        alternates: { canonical: url },
        openGraph: {
            type: "article",
            url,
            title,
            description: desc,
            siteName: process.env.NEXT_PUBLIC_SITE_NAME ?? undefined,
            images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
            authors: article.Users?.username ? [article.Users.username] : undefined,
            publishedTime: article.publishedAt ?? undefined,
            modifiedTime: article.updatedAt ?? undefined,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description: desc,
            images: [ogImage],
        },
    };
}

export default async function Page({ params }: TProps) {
    const { slug } = await params;
    const dataDetailArticle = await getDetailArticleAction(slug);
    let isFollowing: boolean | undefined = undefined;
    if (dataDetailArticle.data?.Users?.id) {
        const { data } = await getIsFollowingAction(dataDetailArticle.data.Users.id);
        isFollowing = data?.following;
    }

    return (
        <>
            {dataDetailArticle.data && isFollowing !== undefined ? (
                <ArticleDetail article={dataDetailArticle.data} isFollowing={isFollowing} />
            ) : (
                <Alert variant="default">
                    <CircleX color="red" />
                    <AlertTitle>No Article</AlertTitle>
                    <AlertDescription>No Article</AlertDescription>
                </Alert>
            )}
        </>
    );
}
