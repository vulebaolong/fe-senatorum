import AvatartImageCustom from "@/components/custom/avatar-custom/avatart-custom";
import { Textarea } from "@/components/textarea/textarea";
import { Button } from "@/components/ui/button";
import { useMention } from "@/hooks/use-mention";
import { useAppSelector } from "@/redux/store";
import { SendHorizontal } from "lucide-react";
import { Dispatch, forwardRef, SetStateAction, useImperativeHandle, useRef, useState } from "react";

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
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
    onSubmit: () => void;
    type: "create" | "edit";
};

const CommentInputUi = forwardRef<CommentInputHandle, TProps>(({ onSubmit, value, setValue, type }, ref) => {
    const info = useAppSelector((state) => state.user.info);
    const [isComposing, setIsComposing] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const { mentionHandlers, popup, open } = useMention({
        trigger: "@",
        limit: 10,
        externalRef: textareaRef, // 👈 dùng ref bạn đã có
        value: value, // (tuỳ chọn) controlled
        onValueChange: (v) => {
            console.log(v);
            setValue(v.normalize("NFC"));
        },
    });

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

    const isEmpty = value.length === 0;

    return (
        <div className="flex items-start gap-2">
            {/* avatar */}
            {type === "create" && (
                <div className="relative z-10 rounded-full flex items-center justify-center">
                    <AvatartImageCustom
                        className="h-8 w-8 rounded-full cursor-pointer"
                        nameFallback={info?.name}
                        nameRouterPush={info?.username}
                        src={info?.avatar}
                    />
                </div>
            )}

            <div className="relative flex-1 min-h-[30px] mt-[1px]">
                {/* Textarea thật: KHÔNG đặt placeholder (để lib không đo theo placeholder) */}
                <Textarea
                    ref={textareaRef}
                    className="flex-1 rounded-2xl h-full min-h-[30px]" // thay cho sx={{ flex: 1 }}
                    placeholder=""
                    minRows={1}
                    maxRows={10}
                    value={value}
                    onChange={(e) => {
                        // setValue(e.target.value.normalize("NFC"));
                        mentionHandlers.onChange(e);
                    }}
                    onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                        // Enter để gửi, Shift+Enter để xuống dòng
                        if (e.key === "Enter" && !e.shiftKey && !isComposing && !open) {
                            e.preventDefault();
                            onSubmit();
                        }
                        mentionHandlers.onKeyDown(e);
                    }}
                    onCompositionStart={() => setIsComposing(true)}
                    onCompositionEnd={() => setIsComposing(false)}
                />
                {popup}

                {/* Fake placeholder: overlay 1 dòng, không làm đổi chiều cao */}
                {isEmpty && (
                    <div
                        aria-hidden
                        className="h-fit pt-[8px] leading-none pointer-events-none absolute inset-y-0 left-3 right-3 flex items-center text-sm text-muted-foreground/70 transition-opacity duration-150"
                        style={{ paddingRight: 0 }}
                    >
                        <span className="truncate">Got a thought? We'd love to hear it 😸</span>
                    </div>
                )}
            </div>

            {/* button send */}
            <Button onClick={onSubmit} variant="outline" size="icon" className="size-8 rounded-full">
                <SendHorizontal />
            </Button>
        </div>
    );
});

export default CommentInputUi;
