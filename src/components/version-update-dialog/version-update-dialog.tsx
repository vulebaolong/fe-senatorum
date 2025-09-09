// components/version/VersionUpdateDialog.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { VERSION } from "@/constant/app.constant";
import { SET_OPEN_VERSION_UPDATE_DIALOG } from "@/redux/slices/setting.slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { RotateCw, Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";

type TProps = {
    latest: string;
};

export function VersionUpdateDialog({ latest }: TProps) {
    const open = useAppSelector((s) => s.setting.openVersionUpdateDialog);
    const dispatch = useAppDispatch();
    const setOpen = (v: boolean) => dispatch(SET_OPEN_VERSION_UPDATE_DIALOG(v));

    const onReload = () => {
        // If you want to force a fresh fetch of assets behind a CDN,
        // you can swap to: window.location.reload();
        window.location.reload();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className="sm:max-w-md p-0 overflow-hidden rounded-xl"
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                {/* Header strip with subtle accent */}
                <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-4 flex items-center gap-3 border-b">
                    <div className="rounded-md bg-primary/10 p-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <DialogTitle className="leading-tight">New version available</DialogTitle>
                        <DialogDescription>An update is ready. Reload to get the latest improvements and fixes.</DialogDescription>
                    </div>
                </div>

                {/* Body */}
                <div className="px-6 py-4 space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Current:</span>
                        <Badge variant="outline" className="font-mono">
                            {VERSION}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Latest:</span>
                        <Badge className="font-mono" variant="secondary">
                            {latest}
                        </Badge>
                    </div>
{/* 
                    {changelogUrl && (
                        <a href={changelogUrl} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">
                            View changelog
                        </a>
                    )} */}

                    <p className="text-xs text-muted-foreground">
                        Tip: If you're in the middle of editing, make sure your changes are saved before reloading.
                    </p>
                </div>

                {/* Footer */}
                <DialogFooter className="px-6 pb-5 gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Later
                    </Button>
                    <Button onClick={onReload}>
                        <RotateCw className="mr-2 h-4 w-4" />
                        Reload now
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
