// components/page-header.tsx
import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type PageHeaderProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
    /** Render element. Defaults to "div". You can pass "header", "section", etc. */
    as?: React.ElementType;
    /** Title can be plain text or any React node (chips, badges, etc.) */
    title?: React.ReactNode;
    /** Back target (uses Next.js <Link/>). If set, a back button is shown. */
    backTo?: string;
    /** Back handler (uses onClick). Ignored when backTo is provided. */
    onBack?: () => void;
    /** Label for the back button. Default: "Back". */
    backLabel?: string;
    /** Extra content placed on the LEFT after the title (e.g., breadcrumbs). */
    start?: React.ReactNode;
    /** Right side actions (e.g., Settings, Publish). */
    end?: React.ReactNode;
    /** Hide vertical separator between back & title. */
    hideSeparator?: boolean;
};

/**
 * PageHeader
 * Reusable top bar for pages/sections.
 *
 * Usage notes:
 *  - Provide `backTo` (URL) or `onBack` (handler) to show the back button.
 *  - `title` accepts string or ReactNode.
 *  - Put buttons for the right side in `end`.
 *  - Change the wrapper element with `as` (e.g., <PageHeader as="header" />).
 */
export function HeaderPage({ as, title, backTo, onBack, backLabel = "Back", start, end, hideSeparator, className, ...rest }: PageHeaderProps) {
    const Comp = (as ?? "div") as React.ElementType;

    const BackBtn = backTo ? (
        <Button variant="link" size="sm" className="text-muted-foreground" asChild>
            <Link href={backTo}>
                <ArrowLeft className="mr-1 h-4 w-4" />
                {backLabel}
            </Link>
        </Button>
    ) : onBack ? (
        <Button variant="link" size="sm" className="text-muted-foreground" onClick={onBack} type="button">
            <ArrowLeft className="mr-1 h-4 w-4" />
            {backLabel}
        </Button>
    ) : null;

    return (
        <Comp className={cn("relative bg-background flex items-center justify-between w-full px-3 py-3 shadow-sm", className)} {...rest}>
            <div className="flex min-w-0 items-center gap-2">
                {BackBtn}
                {!!BackBtn && !!title && !hideSeparator && <Separator orientation="vertical" className="!h-[20px]" />}
                {typeof title === "string" ? <p className="truncate text-lg font-semibold">{title}</p> : title}
                {start}
            </div>

            <div className="flex shrink-0 items-center gap-2">{end}</div>
        </Comp>
    );
}
