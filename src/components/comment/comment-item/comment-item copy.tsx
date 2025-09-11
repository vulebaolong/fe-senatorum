import { useMutationCommentByParent } from "@/api/tantask/comment.tanstack";
import AvatartImageCustom from "@/components/custom/avatar-custom/avatart-custom";
import { formatLocalTime } from "@/helpers/function.helper";
import { typingText } from "@/helpers/motion.helper";
import { cn } from "@/lib/utils";
import { TArticle } from "@/types/article.type";
import { TComment, TListComment } from "@/types/comment.type";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import CommentInput from "../comment-input/comment-input";
import LineCurve from "../line/line-curve";
import LineStraight from "../line/line-straight";

type CommentItemProps = {
    comment: TListComment;
    article: TArticle;
    level?: number;
    isLast: boolean;
};

export default function CommentItem({ comment, article, level = 0, isLast }: CommentItemProps) {
    const router = useRouter();
    const [replyingCommentId, setReplyingCommentId] = useState<TComment["id"] | null>(null);
    const [listComment, setListComment] = useState<TListComment[]>([]);

    // meta phân trang cho replies của comment hiện tại
    const [meta, setMeta] = useState({
        page: 0,
        pageSize: 10, // đổi tuỳ ý
        totalPage: 0,
        totalItem: 0,
    });

    const mutationCommentByParent = useMutationCommentByParent();

    const handleReplyComment = (commentId: TComment["id"]) => {
        setReplyingCommentId(commentId);
    };

    // Lấy thêm 1 "pageSize" replies và nối vào list
    const handleGetCommentByParent = (commentId: TComment["id"]) => {
        // nếu đã tải hết thì thôi
        if (meta.totalPage > 0 && meta.page >= meta.totalPage) return;

        const nextPage = (meta.page || 0) + 1;

        mutationCommentByParent.mutate(
            {
                pagination: { pageIndex: nextPage, pageSize: meta.pageSize },
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

    if (comment.id === "019912a1-85d9-7494-9a0b-adb5083f3024" || comment.id === "019912c8-345d-71ab-835f-17f569afa7f9") {
        console.log({
            id: comment.id,
            level,
            meta: shouldShowLoadMore(meta, listComment),
            isLast,
            page: meta.page,
            pageSize: meta.pageSize,
        });
    }

    return (
        <div className="flex flex-col relative">
            {level > 0 && !isLast && <LineStraight className="absolute bottom-[0] -left-[27px] h-[100%]" />}
            <div className={`flex items-start gap-2 ${level > 0 ? "pl-2" : ""}`}>
                {/* Avatar */}
                <div className="relative z-10 bg-white dark:bg-[#252728] h-9 w-9 rounded-full flex items-center justify-center">
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
                    {/* {replyingCommentId === comment.id && <LineStraight className="absolute bottom-[0] -left-[27px] h-[100%]" />} */}

                    {/* action */}
                    <div className="relative">
                        {/* line */}
                        {level > 0 && <LineCurve className="absolute top-0 -left-[79px] h-[18px] w-[35px]" />}
                        {comment.replyCount > 0 && <LineStraight className="absolute bottom-[0] -left-[27px] h-[100%]" />}
                        {replyingCommentId && <LineStraight className="absolute bottom-[0] -left-[27px] h-[100%]" />}

                        {/* comment */}
                        <div className={cn("rounded-xl p-2 w-fit max-w-full", "bg-[#F0F2F5] dark:bg-[#333334]")}>
                            <div className="text-sm font-semibold leading-none">{comment.Users.name}</div>
                            <div className="text-sm break-words">{comment.content}</div>
                        </div>

                        {/* Meta actions */}
                        <div className={`${comment.replyCount > 0 && !mutationCommentByParent?.data ? `` : `pb-2`}`}>
                            {comment.createdAt ? (
                                <div className="flex items-center gap-3 pl-2">
                                    <span className="text-xs text-muted-foreground">{formatLocalTime(comment.createdAt, `ago`)}</span>

                                    {/* <ActionLink
                                        label="Thích"
                                        onClick={() => {
                                            // TODO: like handler
                                        }}
                                    /> */}

                                    {level < 2 && <ActionLink label="Reply" onClick={() => handleReplyComment(comment.id)} />}
                                </div>
                            ) : (
                                <div className="pl-2 text-xs italic text-muted-foreground">{typingText("Writing")}</div>
                            )}
                        </div>
                    </div>

                    {/* input comment */}
                    {replyingCommentId === comment.id && (
                        <div className={`relative pl-2 pb-2`}>
                            <LineCurve className={`absolute top-0 -left-[27px] h-[16px] w-[28px]`} />
                            {comment.replyCount > 0 && !mutationCommentByParent?.data && (
                                <LineStraight className="absolute bottom-[0] -left-[27px] h-[100%]" />
                            )}
                            {mutationCommentByParent?.data && mutationCommentByParent.data.items.length > 0 && (
                                <LineStraight className="absolute bottom-[0] -left-[27px] h-[100%]" />
                            )}
                            {listComment.length > 0 && <LineStraight className="absolute bottom-[0] -left-[27px] h-[100%]" />}
                            <CommentInput article={article} commentParent={comment} setListComment={setListComment} />
                        </div>
                    )}

                    {listComment.map((c, index) => {
                        return (
                            <div key={c.id} className="flex flex-col">
                                <CommentItem
                                    comment={c}
                                    article={article}
                                    level={c.level}
                                    isLast={index === listComment.length - 1 && !shouldShowLoadMore(meta, listComment)}
                                />
                            </div>
                        );
                    })}

                    {/* Nút xem tất cả phản hồi */}
                    {comment.replyCount > 0 && shouldShowLoadMore(meta, listComment) && (
                        <div className="relative py-2">
                            <LineCurve className="absolute bottom-[12px] -left-[27px] h-[20px] w-[30px]" />
                            <p
                                onClick={() => handleGetCommentByParent(comment.id)}
                                className="pl-2 text-xs text-muted-foreground font-semibold hover:cursor-pointer leading-none"
                            >
                                Xem tất cả {comment.replyCount > meta.pageSize ? meta.pageSize : comment.replyCount} phản hồi
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Đệ quy: render children nếu có */}
            {comment.children && comment.children.length > 0 && (
                <div className="flex flex-col gap-2 pl-12">
                    {comment.children.map((child, index) => {
                        const length = comment.children?.length;
                        return (
                            <Fragment key={child.id}>
                                <CommentItem
                                    comment={child}
                                    article={article}
                                    level={level + 1}
                                    isLast={length ? index === length - 1 : true}
                                />
                            </Fragment>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
/* ========= Helpers / Subcomponents ========= */

function ActionLink({ label, onClick }: { label: string; onClick?: () => void }) {
    return (
        <button type="button" onClick={onClick} className={cn("relative text-xs text-muted-foreground transition-colors", "hover:text-primary")}>
            {label}
            <span className={cn("absolute left-0 -bottom-0.5 h-px w-0 bg-foreground transition-all", "hover:w-full")} />
        </button>
    );
}

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

// Còn bao nhiêu record chưa xem (để hiển thị số)
function leftCount(meta: { totalItem: number }, list: TListComment[], fallbackCount?: number) {
    const total = meta.totalItem || fallbackCount || 0;
    return Math.max(0, total - list.length);
}
