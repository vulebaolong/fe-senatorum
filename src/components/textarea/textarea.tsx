import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/lib/utils"; // hàm merge class của shadcn (tuỳ dự án bạn có)

export function Textarea({ className, ...props }: React.ComponentProps<typeof TextareaAutosize>) {
    return (
        <TextareaAutosize
            {...props}
            className={cn(
                "flex w-full resize-none rounded-2xl ring-1 ring-input px-3 py-[6px] text-sm ",
                    "placeholder:text-muted-foreground ring-offset-background ",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
        />
    );
}
