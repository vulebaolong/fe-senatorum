// components/section-title.tsx
import * as React from "react";
import type { LucideIcon } from "lucide-react";

const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

type Size = "sm" | "md" | "lg";

const S: Record<Size, { icon: string; gap: string; title: string; subtitle: string }> = {
    sm: { icon: "size-4", gap: "gap-1.5", title: "text-sm", subtitle: "text-xs" },
    md: { icon: "size-5", gap: "gap-2", title: "text-base", subtitle: "text-xs" },
    lg: { icon: "size-6", gap: "gap-2.5", title: "text-lg", subtitle: "text-sm" },
};

export interface SectionTitleProps {
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    icon?: LucideIcon; // vd: Settings
    size?: Size; // sm | md | lg (mặc định md)
    className?: string;
    titleClassName?: string; // override nếu bạn dùng "text-md" custom
    subtitleClassName?: string;
}

export function TitleBox({ title, subtitle, icon: Icon, size = "md", className, titleClassName, subtitleClassName }: SectionTitleProps) {
    const s = S[size];
    return (
        <div>
            <div className="flex items-center gap-2">
                {Icon ? <Icon className={cn(s.icon, "text-muted-foreground shrink-0")} /> : null}
                <p className="text-lg font-semibold">{title}</p>
            </div>
            {subtitle ? <p className={cn("text-muted-foreground", s.subtitle, subtitleClassName)}>{subtitle}</p> : null}
        </div>
    );
}
