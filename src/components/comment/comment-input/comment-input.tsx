import { useCreateComment } from "@/api/tantask/comment.tanstack";
import { resError } from "@/helpers/function.helper";
import { useAppSelector } from "@/redux/store";
import { TArticle } from "@/types/article.type";
import { TCreateCommentReq, TListComment } from "@/types/comment.type";
import { ECommentStatus } from "@/types/enum/comment-status.enum";
import { Dispatch, forwardRef, SetStateAction, useState } from "react";
import { toast } from "sonner";
import CommentInputUi from "./comment-input-ui";

function highlightMentions(text: string) {
    // escape HTML để tránh XSS
    const safe = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // regex tìm từ bắt đầu bằng @ + ký tự chữ/số/_
    return safe.replace(/(^|\s)(@\w+)/g, (_, space, mention) => {
        return `${space}<span class="text-blue-500 font-medium">${mention}</span>`;
    });
}

export type CommentInputHandle = {
    focus: () => void;
    insertMention: (username: string) => void;
    focusAndInsertMention: (username: string) => void;
};

type TProps = {
    article: TArticle;
    setListComment: Dispatch<SetStateAction<TListComment[]>>;
    commentParent?: TListComment | null;
    inputId?: string;
};

const CommentInput = forwardRef<CommentInputHandle, TProps>(({ inputId, article, setListComment, commentParent = null }, ref) => {
    const [value, setValue] = useState("");
    const info = useAppSelector((state) => state.user.info);
    const createComment = useCreateComment();

    const handleCreateComment = () => {
        if (value.trim() === "" || !info) return;

        const payload: TCreateCommentReq = {
            articleId: article.id,
            content: value,
            parentId: commentParent?.id || null,
            authorArticleId: article.Users.id,
        };

        const fakeId = Date.now().toString();
        setListComment((prev) => {
            const fakeData: TListComment = {
                id: fakeId,
                status: ECommentStatus.VISIBLE,
                articleId: article.id,
                userId: info.id,
                content: value,
                parentId: commentParent?.id || null,
                level: commentParent ? commentParent.level + 1 : 0,
                replyCount: 0,
                Users: info,
            };

            return [fakeData, ...prev];
        });

        setValue("");

        createComment.mutate(payload, {
            onSuccess: (data) => {
                setListComment((prev) => {
                    prev[0] = data;
                    return [...prev];
                });
            },
            onError: (error) => {
                // rollback optimistic update nếu muốn
                setListComment((prev) => prev.filter((item) => item.id !== fakeId));
                toast.error(resError(error, `Create comment failed`));
            },
        });
    };

    return <CommentInputUi ref={ref} type="create" onSubmit={handleCreateComment} value={value} setValue={setValue} />;
});

export default CommentInput;
