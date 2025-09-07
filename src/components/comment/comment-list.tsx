import { useGetCommentByArticle } from "@/api/tantask/comment.tanstack";
import { TArticle } from "@/types/article.type";
import { TComment, TJoinRoomCommentReq, TListComment, TRoomCommentRes } from "@/types/comment.type";
import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { AppendLoading } from "../data-state/append-state/AppendState";
import NodataOverlay from "../no-data/NodataOverlay";
import { Skeleton } from "../ui/skeleton";
import CommentItem from "./comment-item/comment-item";
import { TJoinRoomReq, TJoinRoomRes } from "@/types/chat.type";
import { TSocketRes } from "@/types/base.type";
import { useSocket } from "@/hooks/socket.hook";
import { SOCKET_COMMENT } from "@/constant/comment.constant";
import { useAppSelector } from "@/redux/store";
import NoCommentsOverlay from "../no-data/no-comments-overlay";

type TProps = {
    article: TArticle;
    listComment: TListComment[];
    setListComment: Dispatch<SetStateAction<TListComment[]>>;
};

export default function CommentList({ article, listComment, setListComment }: TProps) {
    const containerRef = useRef(null);
    const bottomTriggerRef = useRef(null);
    const { socket } = useSocket();
    const info = useAppSelector((state) => state.user.info);

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

    useEffect(() => {
        if (!socket || !info) return;
        const payload: TJoinRoomCommentReq = { articleId: article.id };
        socket?.emit(SOCKET_COMMENT.JOIN_ROOM_COMMENT, payload);

        const handleNewComment = ({ data }: TSocketRes<TRoomCommentRes>) => {
            console.log(data);
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

    const handleEndReached = () => {
        // if (getAllArticle.isFetching || getAllArticle.isLoading || page >= totalPageRef.current) return;
        console.log("handleEndReached");
        // setPage((prev) => prev + 1);
    };

    return (
        <div
            ref={containerRef}
            className={`p-2 h-[500px] flex flex-col overflow-y-scroll border-sidebar-border border shadow-sm rounded-2xl bg-white dark:bg-[#252728]`}
        >
            <div className="relative flex-1">
                <AppendLoading
                    isLoading={getCommentByArticle.isLoading}
                    isEmpty={!getCommentByArticle.data || listComment.length === 0}
                    isError={getCommentByArticle.isError}
                    onBottom={handleEndReached}
                    containerRef={containerRef}
                    footerLoadingComponent={<Skeleton className="min-h-[50px] h-full w-full rounded-xl" />}
                    initialLoadingComponent={<Skeleton className="h-[50px] w-full rounded-xl" />}
                    noDataComponent={
                        <NoCommentsOverlay
                            visible
                            inputId={"comment-input"} // hoặc inputId="comment-input"
                            title="No comments yet"
                            subtitle="Be the first to comment!"
                            // onRequestFocus={() => { if (!isLoggedIn) openLoginModal(); }}
                        />
                    }
                >
                    {listComment.map((comment: TListComment, index) => {
                        return (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                article={article}
                                level={comment.level ?? 0}
                                isLast={index === listComment.length - 1}
                            />
                        );
                    })}
                </AppendLoading>
            </div>
            <div ref={bottomTriggerRef} className="w-full h-1"></div>
        </div>
    );
}
