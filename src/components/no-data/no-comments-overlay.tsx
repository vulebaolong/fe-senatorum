// NoCommentsOverlay.tsx
import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react"; // framer-motion v11 dùng import này
import * as React from "react";

type NoCommentsOverlayProps = {
    visible?: boolean;
    /** Truyền ref của <input>/<textarea> để focus trực tiếp */
    inputRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement>;
    /** Hoặc truyền id của input nếu không có ref */
    inputId?: string;
    /** Nếu cần làm gì thêm trước khi focus (vd. mở modal login) */
    onRequestFocus?: () => void;
    /** Tùy biến text */
    title?: string;
    subtitle?: string;
    /** Thêm className cho overlay nếu cần */
    className?: string;
};

export default function NoCommentsOverlay({
    visible = false,
    inputRef,
    inputId,
    onRequestFocus,
    title = "No comments yet",
    subtitle = "Be the first to comment!",
    className,
}: NoCommentsOverlayProps) {
    const focusTarget = React.useCallback(() => {
        // Cho phép parent chèn logic (vd: check login)
        onRequestFocus?.();

        // Tìm element để focus
        const el = inputRef?.current ?? (inputId ? (document.getElementById(inputId) as HTMLInputElement | HTMLTextAreaElement | null) : null);

        if (el) {
            // scroll trước, focus sau 1 nhịp để mượt
            el.scrollIntoView?.({ behavior: "smooth", block: "center" });
            setTimeout(() => {
                el.focus?.();
                // nếu là textarea, chọn sẵn vị trí con trỏ cuối
                // @ts-ignore
                if (typeof el.setSelectionRange === "function") {
                    const len = (el as HTMLTextAreaElement).value?.length ?? 0;
                    (el as HTMLTextAreaElement).setSelectionRange?.(len, len);
                }
            }, 180);
        }
    }, [onRequestFocus, inputId, inputRef]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={[
                        "absolute inset-0 z-10 flex items-center justify-center",
                        "backdrop-blur-sm bg-background/50", // glass nhẹ
                        className ?? "",
                    ].join(" ")}
                    // Click bất kỳ đâu cũng focus
                    // onClick={focusTarget}
                    // Cho bàn phím: Enter/Space để kích hoạt
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            focusTarget();
                        }
                    }}
                    aria-label="Hãy là người bình luận đầu tiên"
                >
                    <motion.div
                        initial={{ y: 12, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 12, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="pointer-events-auto w-[min(560px,calc(100%-2rem))] px-4"
                    >
                        <div className="rounded-xl border bg-card/70 p-6 text-center shadow-lg backdrop-blur-md">
                            <div className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                <MessageSquarePlus className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="text-base font-semibold">{title}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>

                            <div className="mt-4 flex items-center justify-center gap-2">
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation(); // tránh trigger 2 lần
                                        focusTarget();
                                    }}
                                >
                                    Write the first comment{" "}
                                </Button>
                                {/* <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        focusTarget();
                                    }}
                                >
                                    Bắt đầu nhập…
                                </Button> */}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
