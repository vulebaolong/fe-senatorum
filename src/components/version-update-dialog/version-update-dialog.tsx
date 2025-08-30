// components/version/VersionUpdateDialog.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VERSION } from "@/constant/app.constant";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { SET_OPEN_VERSION_UPDATE_DIALOG } from "@/redux/slices/setting.slice";
import { RotateCw } from "lucide-react";
import * as React from "react";

type TProps = {
    latest: string;
};

export function VersionUpdateDialog({ latest }: TProps) {
    const open = useAppSelector((state) => state.setting.openVersionUpdateDialog);
    const dispatch = useAppDispatch();
    const setOpen = (open: boolean) => {
        dispatch(SET_OPEN_VERSION_UPDATE_DIALOG(open));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className="sm:max-w-md"
                // Không cho đóng khi click ra ngoài / ESC (tuỳ chọn)
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Đã có phiên bản mới</DialogTitle>
                    <DialogDescription>Có bản cập nhật cho ứng dụng. Hãy tải lại để áp dụng thay đổi mới nhất.</DialogDescription>
                </DialogHeader>

                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <div>
                        Hiện tại: <code className="rounded bg-muted px-1 py-0.5">{VERSION}</code>
                    </div>
                    <div>
                        Mới nhất: <code className="rounded bg-muted px-1 py-0.5">{latest}</code>
                    </div>
                </div>

                <DialogFooter className="mt-4 gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Để sau
                    </Button>
                    <Button
                        onClick={() => {
                            window.location.reload();
                        }}
                    >
                        <RotateCw className="mr-2 size-4" />
                        Tải lại
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
