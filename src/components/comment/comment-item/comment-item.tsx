import { useDeleteComment, useMutationCommentByParent, useUpdateComment } from "@/api/tantask/comment.tanstack";
import AvatartImageCustom from "@/components/custom/avatar-custom/avatart-custom";
import ExpandableText from "@/components/expandable-text/ExpandableText";
import Name from "@/components/name/name";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { formatLocalTime } from "@/helpers/function.helper";
import { typingText } from "@/helpers/motion.helper";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/store";
import { TArticle } from "@/types/article.type";
import { TComment, TListComment } from "@/types/comment.type";
import { Spotlight } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import CommentInput, { CommentInputHandle } from "../comment-input/comment-input";
import CommentInputUi from "../comment-input/comment-input-ui";
import LineCurve from "../line/line-curve";
import LineStraight from "../line/line-straight";

type CommentItemProps = {
    comment: TListComment;
    article: TArticle;
    level?: number;
    handleReplyCommentParent?: (commentId: string, username?: string | undefined) => void;
    setRefreshKey: Dispatch<SetStateAction<number>>;
};

const gapAvatarAndLineStraight = 38;

export default function CommentItem({ comment, article, level = 0, handleReplyCommentParent, setRefreshKey }: CommentItemProps) {
    const [replyingCommentId, setReplyingCommentId] = useState<TComment["id"] | null>(null);
    const [listComment, setListComment] = useState<TListComment[]>([]);
    const inputRef = useRef<CommentInputHandle>(null);
    const info = useAppSelector((state) => state.user.info);

    // meta phân trang cho replies của comment hiện tại
    const [meta, setMeta] = useState({
        page: 0,
        pageSize: 10, // đổi tuỳ ý
        totalPage: 0,
        totalItem: 0,
    });

    const mutationCommentByParent = useMutationCommentByParent();
    const updateComment = useUpdateComment();
    const deleteComment = useDeleteComment();

    // ======= LOCAL STATE for EDIT =======
    // giữ content hiển thị cục bộ để có thể cập nhật lạc quan mà không cần refetch ngay
    const [content, setContent] = useState<string>(comment.content);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editValue, setEditValue] = useState<string>(comment.content);
    const [editError, setEditError] = useState<string | null>(null);

    // nếu prop comment.content thay đổi (do refetch từ cha) và hiện không ở chế độ edit -> đồng bộ lại
    useEffect(() => {
        if (!isEditing) {
            setContent(comment.content);
            setEditValue(comment.content);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [comment.content]);

    const handleReplyComment = (commentId: TComment["id"], username?: string) => {
        flushSync(() => setReplyingCommentId(commentId)); // mount input ngay

        // focus + chèn mention
        if (username) {
            inputRef.current?.focusAndInsertMention(username);
        } else {
            inputRef.current?.focus();
        }
    };

    // Lấy thêm 1 "pageSize" replies và nối vào list
    const handleGetCommentByParent = () => {
        // nếu đã tải hết thì thôi
        if (meta.totalPage > 0 && meta.page >= meta.totalPage) return;

        const nextPage = (meta.page || 0) + 1;

        mutationCommentByParent.mutate(
            {
                pagination: { page: nextPage, pageSize: meta.pageSize },
                filters: { articleId: article.id, level: level + 1, parentId: comment.id },
                sort: { sortBy: "createdAt", isDesc: true }, // page 1 mới nhất -> nối vào cuối
            },
            {
                onSuccess: (data) => {
                    setListComment((prev) => appendUnique(prev, data.items));
                    setMeta({
                        page: data.page,
                        pageSize: data.pageSize,
                        totalPage: data.totalPage,
                        totalItem: data.totalItem,
                    });
                },
            }
        );
    };

    // ======= EDIT handlers =======
    const startEdit = () => {
        setIsEditing(true);
        setEditError(null);
        setEditValue(content);
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setEditError(null);
        setEditValue(content);
    };

    const submitEdit = (e?: React.FormEvent) => {
        e?.preventDefault();
        const trimmed = editValue.trim();
        if (!trimmed || trimmed === content || updateComment.isPending) return;

        setEditError(null);

        // Optimistic: cập nhật ngay trên UI
        const previous = content;
        setContent(trimmed);
        setIsEditing(false);

        updateComment.mutate(
            { id: comment.id, content: trimmed },
            {
                onError: (err: any) => {
                    // rollback khi lỗi
                    setContent(previous);
                    setIsEditing(true);
                    setEditError(err?.message || "Không thể cập nhật bình luận. Vui lòng thử lại.");
                },
                onSuccess: (data: any) => {
                    // phòng khi server chuẩn hoá content (ví dụ: sanitize)
                    if (data?.content && data.content !== trimmed) {
                        setContent(data.content);
                    }
                    setIsEditing(false);
                },
            }
        );
    };

    const [isDeleted, setIsDeleted] = useState(false);

    const handleDelete = () => {
        deleteComment.mutate({ id: comment.id });
        setIsDeleted(true);
    };

    const rightRef = useRef<HTMLDivElement>(null);
    const [heightDiff, setHeightDiff] = useState(0);

    useEffect(() => {
        if (!rightRef.current) return;
        const el = rightRef.current;

        const calcHeight = () => {
            console.dir(el);
            const lastChild = el.lastElementChild as HTMLElement | null;
            if (!lastChild) {
                setHeightDiff(0);
                return;
            }
            const parentHeight = el.getBoundingClientRect().height;
            const lastHeight = lastChild.getBoundingClientRect().height;
            setHeightDiff(parentHeight - lastHeight - gapAvatarAndLineStraight);
        };

        // chạy 1 lần khi mount
        calcHeight();

        // theo dõi mọi thay đổi kích thước
        const observer = new ResizeObserver(() => {
            console.log(222);
            calcHeight();
        });

        observer.observe(el);

        return () => observer.disconnect();
    }, []);

    if (isDeleted) return null;

    return (
        <div className="flex flex-col relative">
            <div className={`relative flex items-start gap-2 ${level > 0 ? "pl-2" : ""}`}>
                {level > 0 && <LineCurve className="absolute top-0 right-full h-[18px] w-[25px]" />}

                {/* Avatar */}
                <AvatartImageCustom
                    className="h-8 w-8 rounded-full cursor-pointer"
                    nameFallback={comment.Users?.name}
                    nameRouterPush={comment.Users?.username}
                    src={comment.Users?.avatar}
                />

                {/* Right column */}
                <div ref={rightRef} className="relative flex-1 flex flex-col min-w-0">
                    <LineStraight className={cn(`absolute top-[${gapAvatarAndLineStraight}px] -left-[25px]`)} style={{ height: heightDiff }} />

                    {/* action */}
                    <div className="relative">
                        {/* comment */}
                        <div className={cn("rounded-lg p-2 max-w-full", "shadow-sm bg-background", isEditing ? "w-auto" : "w-fit")}>
                            <div className="flex items-center gap-1">
                                <Name name={comment.Users.name} username={comment.Users.username} />
                                {comment.Users.id === article.userId && (
                                    <Badge className="h-4 w-fit !text-[10px] bg-green-300 text-black" variant="secondary">
                                        <Spotlight className="!w-2.5 !h-2.5" />
                                        Author
                                    </Badge>
                                )}
                            </div>
                            {/* BODY: ExpandableText hoặc ô nhập edit */}
                            {!isEditing ? (
                                <ExpandableText
                                    text={content}
                                    placement="inline"
                                    maxLines={5}
                                    moreLabel="See more"
                                    lessLabel="See less"
                                    fadeHeightClass="h-full"
                                />
                            ) : (
                                <form onSubmit={submitEdit} className="mt-1">
                                    <CommentInputUi type="edit" onSubmit={submitEdit} value={editValue} setValue={setEditValue} />
                                    <span
                                        onClick={cancelEdit}
                                        className={cn("text-xs text-muted-foreground transition-colors cursor-pointer hover:text-primary")}
                                    >
                                        cancel
                                    </span>
                                    {editError && <p className="mt-1 text-xs text-red-500">{editError}</p>}
                                </form>
                            )}
                        </div>

                        {/* Meta actions */}
                        <div className={`pb-2`}>
                            {comment.createdAt ? (
                                <div className="flex items-center gap-3 pl-2">
                                    <span className="text-xs text-muted-foreground">{formatLocalTime(comment.createdAt, `ago`)}</span>

                                    {/* <ActionLink
                                        label="Thích"
                                        onClick={() => {
                                            // TODO: like handler
                                        }}
                                    /> */}

                                    {!isEditing && (
                                        <span
                                            onClick={() => {
                                                if (level === 2) {
                                                    handleReplyCommentParent?.(comment.id, comment.Users?.name || comment.Users?.username);
                                                } else {
                                                    handleReplyComment(comment.id, comment.Users?.name || comment.Users?.username);
                                                }
                                            }}
                                            className={cn("text-xs text-muted-foreground transition-colors cursor-pointer hover:text-primary")}
                                        >
                                            reply
                                        </span>
                                    )}

                                    {info?.id === comment.userId && !isEditing && (
                                        <>
                                            <span
                                                onClick={startEdit}
                                                className={cn("text-xs text-muted-foreground transition-colors cursor-pointer hover:text-primary")}
                                            >
                                                edit
                                            </span>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <span
                                                        className={cn(
                                                            "text-xs text-muted-foreground transition-colors cursor-pointer hover:text-primary"
                                                        )}
                                                    >
                                                        del
                                                    </span>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Bạn có chắc muốn xoá bình luận này?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Hành động này không thể hoàn tác. Bình luận sẽ bị xoá vĩnh viễn khỏi hệ thống.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Huỷ</AlertDialogCancel>
                                                        <AlertDialogAction onClick={handleDelete}>Đồng ý xoá</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="pl-2 text-xs italic text-muted-foreground">{typingText("Writing")}</div>
                            )}
                        </div>
                    </div>

                    {/* input comment */}
                    {replyingCommentId && (
                        <div className={`relative pl-2 pb-2`}>
                            <LineCurve className={`absolute top-0 right-full h-[16px] w-[25px]`} />
                            <CommentInput ref={inputRef} article={article} commentParent={comment} setListComment={setListComment} />
                        </div>
                    )}

                    {listComment.map((c, index) => {
                        return (
                            // <div key={c.id} className="flex flex-col">
                            <CommentItem
                                key={c.id}
                                setRefreshKey={setRefreshKey}
                                comment={c}
                                article={article}
                                level={c.level}
                                // isLast={index === listComment.length - 1 && (!shouldShowLoadMore(meta, listComment) || comment.replyCount === 0)}
                                handleReplyCommentParent={handleReplyComment}
                            />
                            // </div>
                        );
                    })}

                    {/* Nút xem tất cả phản hồi */}
                    {comment.replyCount > 0 && shouldShowLoadMore(meta, listComment) && (
                        <div className="relative pb-2">
                            <LineCurve className="absolute top-[0px] right-full h-[15px] w-[25px]" />

                            <span
                                onClick={() => handleGetCommentByParent()}
                                className={cn("pl-2 text-sm text-muted-foreground transition-colors cursor-pointer hover:text-primary leading-none")}
                            >
                                View all {comment.replyCount > meta.pageSize ? meta.pageSize : comment.replyCount} comments
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
/* ========= Helpers / Subcomponents ========= */

// Nối thêm nhưng tránh trùng id
function appendUnique(prev: TListComment[], next: TListComment[]) {
    const seen = new Set(prev.map((i) => i.id));
    const merged = [...prev];
    for (const n of next) if (!seen.has(n.id)) merged.push(n);
    return merged;
}

// Hiển thị nút “Xem thêm” khi còn trang/record để tải
function shouldShowLoadMore(meta: { page: number; totalPage: number; totalItem: number }, list: TListComment[]) {
    if (meta.totalPage && meta.page) return meta.page < meta.totalPage;
    if (meta.totalItem) return list.length < meta.totalItem;
    // fallback khi chưa có meta (chưa click lần đầu)
    return true;
}
