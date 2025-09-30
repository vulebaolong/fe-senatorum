import { useGetCommentByArticle } from "@/api/tantask/comment.tanstack";
import { SOCKET_COMMENT } from "@/constant/comment.constant";
import { useSocket } from "@/hooks/socket.hook";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/store";
import { TArticle } from "@/types/article.type";
import { TSocketRes } from "@/types/base.type";
import { TJoinRoomCommentReq, TListComment, TRoomCommentRes } from "@/types/comment.type";
import { Dispatch, Fragment, SetStateAction, useEffect, useRef, useState } from "react";
import { AppendLoading } from "../data-state/append-state/AppendState";
import NoCommentsOverlay from "../no-data/no-comments-overlay";
import { Skeleton } from "../ui/skeleton";
import CommentItem from "./comment-item/comment-item";

type TProps = {
    article: TArticle;
    listComment: TListComment[];
    setListComment: Dispatch<SetStateAction<TListComment[]>>;
    className?: string;
};

export default function CommentList({ article, listComment, setListComment, className }: TProps) {
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const totalPageRef = useRef(0);
    const containerRef = useRef(null);

    const { socket } = useSocket();
    const info = useAppSelector((state) => state.user.info);

    const [filtersValue] = useState({
        articleId: article.id,
        level: 0,
    });

    const getCommentByArticle = useGetCommentByArticle({
        pagination: { page: page, pageSize },
        filters: filtersValue,
        sort: { sortBy: `createdAt`, isDesc: true },
    });

    useEffect(() => {
        if (!getCommentByArticle.data?.items) return;

        const newComment = getCommentByArticle.data.items;

        setListComment((prev) => {
            if (page === 1) return newComment;
            return [...prev, ...newComment];
        });
    }, [getCommentByArticle.data?.items]);

    useEffect(() => {
        if (!socket || !info) return;
        const payload: TJoinRoomCommentReq = { articleId: article.id };
        socket?.emit(SOCKET_COMMENT.JOIN_ROOM_COMMENT, payload);

        const handleNewComment = ({ data }: TSocketRes<TRoomCommentRes>) => {
            if (data.authorIdComment === info.id) return;
            if (data.parentId === null || data.level === 0) {
                // Cách 1: refetch ngay, KHÔNG bật isLoading (chỉ isFetching = true)
                getCommentByArticle.refetch();
            } else {
                // setRefreshCommentByParentId(data.parentId);
            }
        };
        socket?.on(SOCKET_COMMENT.NEW_COMMENT, handleNewComment);

        return () => {
            socket?.off(SOCKET_COMMENT.NEW_COMMENT, handleNewComment);
        };
    }, [socket, info]);

    useEffect(() => {
        if (getCommentByArticle.data?.totalPage) totalPageRef.current = getCommentByArticle.data.totalPage;
    }, [getCommentByArticle.data?.totalPage]);

    const handleEndReached = () => {
        if (getCommentByArticle.isFetching || getCommentByArticle.isLoading || page >= totalPageRef.current) return;
        setPage((prev) => prev + 1);
    };

    return (
        <div ref={containerRef} className={cn("relative", "h-full lg:overflow-y-scroll", className)}>
            <AppendLoading
                isLoading={getCommentByArticle.isLoading}
                isEmpty={!getCommentByArticle.data || listComment.length === 0}
                isError={getCommentByArticle.isError}
                onLoadMore={handleEndReached}
                containerRef={containerRef}
                footerLoadingComponent={<Skeleton className="min-h-[50px] h-full w-full rounded-xl" />}
                initialLoadingComponent={<Skeleton className="h-[50px] w-full rounded-xl" />}
                noDataComponent={
                    <NoCommentsOverlay
                        visible
                        inputId={"comment-input"} // hoặc inputId="comment-input"
                        className="max-h-[500px]"
                        // title="No comments yet"
                        // subtitle="Be the first to comment!"
                        // onRequestFocus={() => { if (!isLoggedIn) openLoginModal(); }}
                    />
                }
            >
                {listComment.map((comment: TListComment, index) => {
                    return (
                        <Fragment key={comment.id}>
                            <CommentItem comment={comment} article={article} level={comment.level ?? 0} isLast={index === listComment.length - 1} />
                        </Fragment>
                    );
                })}
            </AppendLoading>
        </div>
    );
}
