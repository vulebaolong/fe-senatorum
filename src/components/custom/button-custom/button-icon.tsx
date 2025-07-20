import type { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";

type ButtonIconProps = {
    className?: string;
} & React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    };

export default function ButtonIcon({ children, className, ...props }: ButtonIconProps) {
    return (
        <Button className={cn("group hover:text-foreground cursor-pointer", className)} {...props}>
            <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">{children}</span>
        </Button>
    );
}
