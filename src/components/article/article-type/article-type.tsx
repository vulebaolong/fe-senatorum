import ImageCustom from "@/components/custom/image-custom/ImageCustom";
import { cn } from "@/lib/utils";
import { TArticle } from "@/types/article.type";

type TProps = {
    type: TArticle["Types"];
};

export default function ArticleType({ type }: TProps) {
    const [imageName, color] = type.slug.split("_");
    return (
        <div className={cn("flex items-center gap-1.5 justify-end rounded-md px-2 py-1")} style={{ background: color }}>
            <div className="size-3">
                <ImageCustom src={`/images/article-type/${imageName}.webp`} alt={type.name} />
            </div>
            <p className=" text-xs text-black font-bold truncate leading-none">{type.name}</p>
        </div>
    );
}
