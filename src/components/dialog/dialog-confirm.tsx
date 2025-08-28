import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import * as React from "react";

type ConfirmDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: React.ReactNode;
    description?: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    onConfirm: () => void;
    /** destructive => nút đỏ */
    variant?: "default" | "destructive";
    /** Cho phép đóng khi click ra ngoài/ESC (mặc định true) */
    closeOnOutside?: boolean;
};

export default function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    loading,
    onConfirm,
    variant = "default",
    closeOnOutside = true,
}: ConfirmDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                onPointerDownOutside={closeOnOutside ? undefined : (e) => e.preventDefault()}
                onEscapeKeyDown={closeOnOutside ? undefined : (e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description ? <DialogDescription>{description}</DialogDescription> : null}
                </DialogHeader>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={!!loading}>
                        {cancelText}
                    </Button>
                    <Button variant={variant === "destructive" ? "destructive" : "default"} onClick={onConfirm} disabled={!!loading}>
                        {loading ? "Processing..." : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
