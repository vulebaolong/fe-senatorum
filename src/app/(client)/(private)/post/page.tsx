import Articlelist from "@/components/article/article-list/article-list";
import { EArticleVariant } from "@/types/enum/article.enum";

export default function Page() {
    return <Articlelist type="all" filters={{ variant: EArticleVariant.POST }} />;
}
