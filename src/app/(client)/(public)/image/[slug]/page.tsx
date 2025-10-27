import { getDetailArticleAction } from "@/api/actions/article.action";
import { getIsFollowingAction } from "@/api/actions/follow.action";
import { getDetailGalleryImageAction } from "@/api/actions/gallery-image.action";
import GalleryImageDetail from "@/components/gallery/gallery-image-detail";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY, NEXT_PUBLIC_BASE_DOMAIN_FE, TITLE } from "@/constant/app.constant";
import { getAccessToken } from "@/helpers/cookies.helper";
import { CircleX } from "lucide-react";

import type { Metadata } from "next";

type TProps = {
    params: Promise<{ slug: string }>;
};

const ogUrl = (publicId?: string) =>
    publicId ? `${NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY}/c_fill,w_1200,h_630,q_auto,f_jpg/${publicId}` : `${NEXT_PUBLIC_BASE_DOMAIN_FE}/og-default.jpg`;

export async function generateMetadata({ params }: TProps): Promise<Metadata> {
    const { slug } = await params;
    const { data: article } = await getDetailArticleAction(slug);

    if (!article) return {};

    const url = `${NEXT_PUBLIC_BASE_DOMAIN_FE}/image/${article.slug}`;
    const title = article.title;
    const desc = article.title;
    const ogImage = ogUrl(article.thumbnail);

    const result: Metadata = {
        title, // sẽ áp dụng template ở Root: "%s | TITLE"
        description: desc,
        alternates: { canonical: url },
        openGraph: {
            type: "article",
            url,
            title,
            description: desc,
            siteName: TITLE ?? undefined,
            images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
            authors: article.Users?.username ? [article.Users.username] : undefined,
            publishedTime: article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined,
            modifiedTime: article.updatedAt ? new Date(article.updatedAt).toISOString() : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description: desc,
            images: [ogImage],
        },
    };

    // console.dir({ result }, { depth: null, colors: true });

    return result;
}

export default async function Page({ params }: TProps) {
    const { slug } = await params;
    const dataDetailArticle = await getDetailGalleryImageAction(slug);
    const accessToken = await getAccessToken();
    let isFollowing: boolean | undefined = undefined;
    if (dataDetailArticle.data?.Users?.id && accessToken) {
        const { data } = await getIsFollowingAction(dataDetailArticle.data.Users.id);
        isFollowing = data?.following;
    }

    return (
        <>
            {dataDetailArticle.data ? (
                <GalleryImageDetail article={dataDetailArticle.data} isFollowing={isFollowing} />
            ) : (
                <Alert variant="default">
                    <CircleX color="red" />
                    <AlertTitle>No Image</AlertTitle>
                    <AlertDescription>No Image</AlertDescription>
                </Alert>
            )}
        </>
    );
}
