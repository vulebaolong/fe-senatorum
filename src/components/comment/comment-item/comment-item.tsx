import { useMutationCommentByParent } from "@/api/tantask/comment.tanstack";
import AvatartImageCustom from "@/components/custom/avatar-custom/avatart-custom";
import ExpandableText from "@/components/expandable-text/ExpandableText";
import Name from "@/components/name/name";
import { Badge } from "@/components/ui/badge";
import { formatLocalTime } from "@/helpers/function.helper";
import { typingText } from "@/helpers/motion.helper";
import { cn } from "@/lib/utils";
import { TArticle } from "@/types/article.type";
import { TComment, TListComment } from "@/types/comment.type";
import { Spotlight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import CommentInput, { CommentInputHandle } from "../comment-input/comment-input";
import LineCurve from "../line/line-curve";
import LineStraight from "../line/line-straight";

type CommentItemProps = {
    comment: TListComment;
    article: TArticle;
    level?: number;
    isLast: boolean;
    handleReplyCommentParent?: (commentId: string, username?: string | undefined) => void;
};

export default function CommentItem({ comment, article, level = 0, isLast, handleReplyCommentParent }: CommentItemProps) {
    const router = useRouter();
    const [replyingCommentId, setReplyingCommentId] = useState<TComment["id"] | null>(null);
    const [listComment, setListComment] = useState<TListComment[]>([]);
    const inputRef = useRef<CommentInputHandle>(null);

    // meta phân trang cho replies của comment hiện tại
    const [meta, setMeta] = useState({
        page: 0,
        pageSize: 10, // đổi tuỳ ý
        totalPage: 0,
        totalItem: 0,
    });

    const mutationCommentByParent = useMutationCommentByParent();

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
    const handleGetCommentByParent = (commentId: TComment["id"]) => {
        // nếu đã tải hết thì thôi
        if (meta.totalPage > 0 && meta.page >= meta.totalPage) return;

        const nextPage = (meta.page || 0) + 1;

        mutationCommentByParent.mutate(
            {
                pagination: { page: nextPage, pageSize: meta.pageSize },
                filters: { articleId: article.id, level: level + 1, parentId: commentId },
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

    return (
        <div className="flex flex-col relative">
            {level > 0 && !isLast && <LineStraight className="absolute bottom-[0] -left-[25px] h-[100%]" />}
            <div className={`relative flex items-start gap-2 ${level > 0 ? "pl-2" : ""}`}>
                {level > 0 && <LineCurve className="absolute top-0 right-full h-[18px] w-[25px]" />}
                {/* Avatar */}
                <div className={cn("relative z-10 bg-[#f5f5f5] dark:bg-[#151515] h-10 w-8 rounded-full flex items-start justify-center")}>
                    <AvatartImageCustom
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/${comment.Users?.username}`);
                        }}
                        className="h-8 w-8 rounded-full cursor-pointer"
                        name={comment.Users?.name}
                        src={comment.Users?.avatar}
                    />
                </div>

                {/* Right column */}
                <div className="relative flex-1 flex flex-col">
                    {/* action */}
                    <div className="relative">
                        {/* line */}
                        {comment.replyCount > 0 && <LineStraight className="absolute bottom-[0] -left-[25px] h-[100%]" />}
                        {replyingCommentId && <LineStraight className="absolute bottom-[0] -left-[25px] h-[100%]" />}

                        {/* comment */}
                        <div className={cn("rounded-lg p-2 w-fit max-w-full", "bg-[#fff] dark:bg-[#333334]")}>
                            <div className="flex items-center gap-1">
                                <Name name={comment.Users.name} username={comment.Users.username} />
                                {comment.Users.id === article.userId && (
                                    <Badge className="h-4 w-fit !text-[10px] bg-green-300 text-black" variant="secondary">
                                        <Spotlight className="!w-2.5 !h-2.5" />
                                        Author
                                    </Badge>
                                )}
                            </div>
                            <ExpandableText
                                text={comment.content}
                                placement="inline"
                                maxLines={5}
                                moreLabel="...more"
                                lessLabel="less"
                                fadeFromClass="from-[#fff] dark:from-[#333334]"
                                inlineButtonBgClass="bg-[#fff] dark:bg-[#333334]"
                                fadeHeightClass="h-full"
                            />
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

                                    <span
                                        onClick={() => {
                                            if (level === 2) {
                                                handleReplyCommentParent?.(comment.id, comment.Users?.username || comment.Users?.name);
                                            } else {
                                                handleReplyComment(comment.id, comment.Users?.username || comment.Users?.name);
                                            }
                                        }}
                                        className={cn("text-xs text-muted-foreground transition-colors cursor-pointer hover:text-primary")}
                                    >
                                        reply
                                    </span>
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
                            {comment.replyCount > 0 && !mutationCommentByParent?.data && (
                                <LineStraight className="absolute bottom-[0] -left-[25px] h-[100%]" />
                            )}
                            {mutationCommentByParent?.data && mutationCommentByParent.data.items.length > 0 && (
                                <LineStraight className="absolute bottom-[0] -left-[25px] h-[100%]" />
                            )}
                            {listComment.length > 0 && <LineStraight className="absolute bottom-[0] -left-[25px] h-[100%]" />}
                            <CommentInput ref={inputRef} article={article} commentParent={comment} setListComment={setListComment} />
                        </div>
                    )}

                    {listComment.map((c, index) => {
                        return (
                            <div key={c.id} className="flex flex-col">
                                <CommentItem
                                    comment={c}
                                    article={article}
                                    level={c.level}
                                    isLast={index === listComment.length - 1 && (!shouldShowLoadMore(meta, listComment) || comment.replyCount === 0)}
                                    handleReplyCommentParent={handleReplyComment}
                                />
                            </div>
                        );
                    })}

                    {/* Nút xem tất cả phản hồi */}
                    {comment.replyCount > 0 && shouldShowLoadMore(meta, listComment) && (
                        <div className="relative pb-2">
                            <LineCurve className="absolute top-[0px] right-full h-[15px] w-[25px]" />

                            <span
                                onClick={() => handleGetCommentByParent(comment.id)}
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
