import { Loader2 } from "lucide-react";
import { ReactNode, useEffect } from "react";

type AppendLoadingProps = {
    isLoading: boolean;
    isEmpty: boolean;
    isError: boolean;
    footerLoadingComponent?: ReactNode;
    initialLoadingComponent?: ReactNode;
    noDataComponent?: ReactNode;
    children: ReactNode;
    onBottom?: () => void;
    containerRef: React.RefObject<HTMLElement | null>;
    bottomTriggerRef: React.RefObject<HTMLElement | null>;
    debug?: boolean;
};

export function AppendLoading({
    debug = false,
    isLoading,
    isEmpty,
    isError,
    footerLoadingComponent,
    initialLoadingComponent,
    children,
    onBottom,
    containerRef,
    bottomTriggerRef,
    noDataComponent,
}: AppendLoadingProps) {
    const showFooter = isLoading && !isEmpty && !isError;
    const showNoData = (isEmpty || isError) && !isLoading;
    const showInitialLoading = isLoading && isEmpty && !isError;

    if (debug) console.log({ showFooter, showNoData, showInitialLoading });

    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (debug) console.log("LOADER VISIBLE");
                    if (onBottom) onBottom();
                }
            },
            {
                root: containerRef.current,
                rootMargin: "0px",
                threshold: 0.1,
            }
        );

        const el = bottomTriggerRef.current;
        if (el) {
            if (debug) console.log(`Observering`);
            observer.observe(el);
        }

        return () => {
            if (el) {
                if (debug) console.log(`Delete Observering`);
                observer.unobserve(el);
            }
        };
    }, [bottomTriggerRef.current, onBottom, containerRef.current]);

    if (showInitialLoading) {
        return <>{initialLoadingComponent || <Loader2 className="h-5 w-5 animate-spin" />}</>;
    }

    if (showNoData) {
        return <>{noDataComponent || <p className="text-muted-foreground text-sm">No Data</p>}</>;
    }

    return (
        <>
            {children}
            {showFooter && <>{footerLoadingComponent || <Loader2 className="h-5 w-5 animate-spin" />}</>}
        </>
    );
}
