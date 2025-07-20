import Nodata from "@/components/no-data/Nodata";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

type OverlayStateProps = {
    isLoading: boolean;
    isEmpty: boolean;
    isError: boolean;
    loadingComponent?: ReactNode;
    noDataComponent?: ReactNode;
    children: ReactNode;
};

export function OverlayState({ isLoading, isEmpty, isError, loadingComponent, noDataComponent, children }: OverlayStateProps) {
    return (
        <div className="relative">
            {isLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center  backdrop-blur-sm">
                    {loadingComponent || <Loader2 className="h-5 w-5 animate-spin" />}
                </div>
            )}
            {!isLoading && (isEmpty || isError) && (
                <div className="absolute inset-0 z-10 flex items-center justify-center  backdrop-blur-sm">{noDataComponent || <Nodata />}</div>
            )}
            {children}
        </div>
    );
}
