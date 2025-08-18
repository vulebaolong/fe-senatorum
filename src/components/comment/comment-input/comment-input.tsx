import { useCreateComment } from "@/api/tantask/comment.tanstack";
import { Textarea } from "@/components/textarea/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { resError } from "@/helpers/function.helper";
import { useAppSelector } from "@/redux/hooks";
import { TArticle } from "@/types/article.type";
import { TCreateCommentReq, TListComment } from "@/types/comment.type";
import { ECommentStatus } from "@/types/enum/comment-status.enum";
import { SendHorizontal } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

type TProps = {
    article: TArticle;
    setListComment: Dispatch<SetStateAction<TListComment[]>>;
    commentParent?: TListComment | null;
};

export default function CommentInput({ article, setListComment, commentParent = null }: TProps) {
    const [value, setValue] = useState("");
    const info = useAppSelector((state) => state.user.info);
    const [isComposing, setIsComposing] = useState(false);

    const createComment = useCreateComment();

    const handleCreateComment = () => {
        if (value.trim() === "" || !info) return;

        const payload: TCreateCommentReq = {
            articleId: article.id,
            content: value,
            parentId: commentParent?.id || null,
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

        createComment.mutate(payload, {
            onSuccess: (data) => {
                setValue("");
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
            <div className="relative z-10 bg-white dark:bg-[#252728] w-9 rounded-full flex items-center justify-center">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={info?.avatar ?? undefined} alt={`name`} />
                    <AvatarFallback className="rounded-lg">{info?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
            </div>

            {/* input */}
            <Textarea
                className="flex-1 rounded-2xl" // thay cho sx={{ flex: 1 }}
                placeholder="Join the comments..."
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
}
