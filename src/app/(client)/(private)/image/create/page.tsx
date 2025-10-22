import { getDraftGalleryImageAction } from "@/api/actions/gallery-image.action";
import GalleryImageUpload from "@/components/gallery/gallery-image-upload";

export default async function Page() {
    const dataArticleDaft = await getDraftGalleryImageAction();

    return <GalleryImageUpload type="create" dataArticle={dataArticleDaft} />;
}
