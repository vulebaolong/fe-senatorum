import { useGetCommentByArticle } from "@/api/tantask/comment.tanstack";
import { TArticle } from "@/types/article.type";
import { TListComment } from "@/types/comment.type";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Nodata from "../no-data/Nodata";
import { AppendLoading } from "../data-state/append-state/AppendState";
import { Skeleton } from "../ui/skeleton";
import NodataOverlay from "../no-data/NodataOverlay";

type TProps = {
    article: TArticle;
    listComment: TListComment[];
    setListComment: Dispatch<SetStateAction<TListComment[]>>;
};

export default function CommentList({ article, listComment, setListComment }: TProps) {
    const containerRef = useRef(null);
    const bottomTriggerRef = useRef(null);

    const [pagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [filtersValue] = useState({
        articleId: article.id,
        level: 0,
    });

    const getCommentByArticle = useGetCommentByArticle({
        pagination: { pageIndex: pagination.pageIndex + 1, pageSize: pagination.pageSize },
        filters: filtersValue,
        sort: { sortBy: `createdAt`, isDesc: true },
    });

    useEffect(() => {
        if (getCommentByArticle.data?.items) {
            setListComment(getCommentByArticle.data?.items);
        }
    }, [getCommentByArticle.data?.items]);

    const handleEndReached = () => {
        // if (getAllArticle.isFetching || getAllArticle.isLoading || page >= totalPageRef.current) return;
        console.log("handleEndReached");
        // setPage((prev) => prev + 1);
    };

    return (
        <div ref={containerRef} className={`p-5 h-[200px] flex flex-col overflow-y-scroll`}>
            <div className="relative flex-1">
                <AppendLoading
                    isLoading={getCommentByArticle.isLoading}
                    isEmpty={!getCommentByArticle.data || listComment.length === 0}
                    isError={getCommentByArticle.isError}
                    bottomTriggerRef={bottomTriggerRef}
                    onBottom={handleEndReached}
                    containerRef={containerRef}
                    footerLoadingComponent={<Skeleton className="min-h-[50px] h-full w-full rounded-xl" />}
                    initialLoadingComponent={<Skeleton className="h-[50px] w-full rounded-xl" />}
                    noDataComponent={<NodataOverlay visible />}
                >
                    {listComment.map((comment: TListComment) => (
                        // <CommentItem key={comment._id} comment={comment} article={article} level={0} />
                        <p key={comment.id}>{comment.content}</p>
                    ))}
                </AppendLoading>
            </div>
            <div ref={bottomTriggerRef} className="w-full h-1"></div>
        </div>
    );
}
