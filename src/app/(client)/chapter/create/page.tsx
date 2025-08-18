import { getDraftChapterAction } from "@/api/actions/chapter.action";
import ChapterCreate from "@/components/chapter/chapter-create";

export default async function Page() {
    const dataChapterDaft = await getDraftChapterAction();

    return <ChapterCreate dataChapterDaft={dataChapterDaft} />;
}
