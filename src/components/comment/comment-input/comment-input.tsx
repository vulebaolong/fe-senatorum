import { useCreateComment } from "@/api/tantask/comment.tanstack";
import AvatartImageCustom from "@/components/custom/avatar-custom/avatart-custom";
import { Textarea } from "@/components/textarea/textarea";
import { Button } from "@/components/ui/button";
import { resError } from "@/helpers/function.helper";
import { useAppSelector } from "@/redux/store";
import { TArticle } from "@/types/article.type";
import { TCreateCommentReq, TListComment } from "@/types/comment.type";
import { ECommentStatus } from "@/types/enum/comment-status.enum";
import { SendHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, forwardRef, SetStateAction, useEffect, useImperativeHandle, useRef, useState } from "react";
import { toast } from "sonner";

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
    const [isComposing, setIsComposing] = useState(false);
    const router = useRouter();
    const createComment = useCreateComment();

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
        focus: () => {
            const el = textareaRef.current;
            if (!el) return;
            el.focus();
            try {
                const len = el.value.length;
                el.setSelectionRange(len, len);
            } catch {}
        },
        insertMention: (username: string) => {
            const el = textareaRef.current;
            const uname = (username || "").replace(/^@/, "");
            const mention = `@${uname} `;
            setValue((prev) => {
                // nếu đã có mention ở đầu thì bỏ qua
                if (prev.startsWith(mention)) return prev;

                // nếu có caret, chèn tại caret; không thì prepend
                if (el && typeof el.selectionStart === "number") {
                    const s = el.selectionStart;
                    const e = el.selectionEnd ?? s;
                    const next = prev.slice(0, s) + mention + prev.slice(e);
                    // đặt caret sau mention
                    requestAnimationFrame(() => {
                        const pos = s + mention.length;
                        el.setSelectionRange(pos, pos);
                    });
                    return next;
                }
                return mention + prev;
            });
        },
        focusAndInsertMention: (username: string) => {
            const el = textareaRef.current;
            if (!el) return;
            el.focus();
            try {
                const len = el.value.length;
                el.setSelectionRange(len, len);
            } catch {}
            // chèn sau khi focus để caret đúng vị trí
            const uname = (username || "").replace(/^@/, "");
            const mention = `@${uname} `;
            setValue((prev) => (prev.startsWith(mention) ? prev : mention + prev));
            requestAnimationFrame(() => {
                const el2 = textareaRef.current;
                if (el2) {
                    const pos = mention.length;
                    el2.setSelectionRange(pos, pos);
                }
            });
        },
    }));

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

    return (
        <div className="flex items-start gap-2">
            {/* avatar */}
            <div className="relative z-10 bg-white dark:bg-[#252728] rounded-full flex items-center justify-center">
                <AvatartImageCustom
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/${info?.username}`);
                    }}
                    className="h-8 w-8 rounded-full cursor-pointer"
                    name={info?.name}
                    src={info?.avatar}
                />
            </div>

            {/* input */}
            <Textarea
                id={inputId}
                ref={textareaRef}
                className="flex-1 rounded-2xl" // thay cho sx={{ flex: 1 }}
                placeholder="Got a thought? We'd love to hear it 😸"
                minRows={1}
                maxRows={10}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                    // Enter để gửi, Shift+Enter để xuống dòng
                    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
                        e.preventDefault();
                        handleCreateComment();
                    }
                }}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
            />

            {/* button send */}
            <Button onClick={handleCreateComment} variant="outline" size="icon" className="size-8 rounded-full">
                <SendHorizontal />
            </Button>
        </div>
    );
});

export default CommentInput;
