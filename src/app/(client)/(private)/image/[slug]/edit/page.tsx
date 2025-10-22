import { getDetailGalleryImageAction } from "@/api/actions/gallery-image.action";
import GalleryImageUpload from "@/components/gallery/gallery-image-upload";

type TProps = {
    params: Promise<{ slug: string }>;
};

export default async function Page({ params }: TProps) {
    const { slug } = await params;

    const dataGalleryImageDetail = await getDetailGalleryImageAction(slug);

    return <GalleryImageUpload type="edit" dataArticle={dataGalleryImageDetail} />;
}
