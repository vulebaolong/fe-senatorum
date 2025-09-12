import { useGetCommentByArticle } from "@/api/tantask/comment.tanstack";
import { TArticle } from "@/types/article.type";
import { TComment, TJoinRoomCommentReq, TListComment, TRoomCommentRes } from "@/types/comment.type";
import { Dispatch, Fragment, RefObject, SetStateAction, useEffect, useRef, useState } from "react";
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
import { capLevel } from "@/helpers/function.helper";
import ClickSpark from "../ClickSpark";

type TProps = {
    article: TArticle;
    listComment: TListComment[];
    setListComment: Dispatch<SetStateAction<TListComment[]>>;
};

export default function CommentList({ article, listComment, setListComment }: TProps) {
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const totalPageRef = useRef(0);
    const containerRef = useRef(null);
    const bottomTriggerRef = useRef(null);

    const { socket } = useSocket();
    const info = useAppSelector((state) => state.user.info);

    const [filtersValue] = useState({
        articleId: article.id,
        level: 0,
    });

    const getCommentByArticle = useGetCommentByArticle({
        pagination: { pageIndex: page, pageSize },
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

    useEffect(() => {
        if (getCommentByArticle.data?.totalPage) totalPageRef.current = getCommentByArticle.data.totalPage;
    }, [getCommentByArticle.data?.totalPage]);

    const handleEndReached = () => {
        // if (getAllArticle.isFetching || getAllArticle.isLoading || page >= totalPageRef.current) return;
        // setPage((prev) => prev + 1);
        console.log("handleEndReached", getCommentByArticle.isFetching, getCommentByArticle.isLoading, page, totalPageRef.current);
        if (getCommentByArticle.isFetching || getCommentByArticle.isLoading || page >= totalPageRef.current) return;
        setPage((prev) => prev + 1);
    };

    return (
        <div
            ref={containerRef}
            className={`p-2 pb-1 h-[500px] flex flex-col overflow-y-scroll border-sidebar-border border shadow-sm rounded-2xl bg-white dark:bg-[#252728]`}
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
                            // title="No comments yet"
                            // subtitle="Be the first to comment!"
                            // onRequestFocus={() => { if (!isLoggedIn) openLoginModal(); }}
                        />
                    }
                >
                    {listComment.map((comment: TListComment, index) => {
                        return (
                            <Fragment key={comment.id}>
                                <CommentItem
                                    comment={comment}
                                    article={article}
                                    level={comment.level ?? 0}
                                    isLast={index === listComment.length - 1}
                                />
                            </Fragment>
                        );
                    })}
                </AppendLoading>
            </div>
            <div ref={bottomTriggerRef} className="w-full h-1 shrink"></div>
        </div>
    );
}
