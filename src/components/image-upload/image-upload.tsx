"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Image as ImageIcon, Loader2, Trash } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";

type UploadFn = (file: File) => Promise<string>;

export type ThumbnailUploadProps = {
    value?: string | null; // publicId hiện tại
    isUploading?: boolean; // (optional) điều khiển pending từ ngoài

    // up lên server rồi mới show
    onUploadToServer?: UploadFn; // mutationAsync vào đây
    onSuccessToServer?: (publicId: string) => void; // ghi vào form (vd: setValue)

    // chỉ show không up server
    onUploadToLocal?: (file: File | null) => void; // chỉ show hình

    onUploadError?: (err: unknown) => void;

    // ==== optional ====
    onDelete?: () => void | Promise<void>; // nếu cần gọi API xoá bên server
    disabled?: boolean; // khoá hoàn toàn component
    accept?: string; // mặc định image/*
    className?: string;
    variant?: "square" | "round";
    title?: string;
    description?: string;
};

export default function ImageUpload({
    value,
    onSuccessToServer,
    onUploadToServer,
    onUploadToLocal,
    isUploading,
    onUploadError,
    onDelete,
    disabled,
    accept = "image/*",
    className,
    title,
    description,
    variant = "square",
}: ThumbnailUploadProps) {
    const [dragActive, setDragActive] = useState(false);
    const [tempUrl, setTempUrl] = useState<string | null>(null); // blob preview
    const [localPending, setLocalPending] = useState(false); // nếu bạn KHÔNG truyền isUploading
    const inputRef = useRef<HTMLInputElement>(null);

    const pending = !!(isUploading ?? localPending);
    const locked = disabled || pending;

    const displayUrl = tempUrl || value;

    // cleanup blob khi unmount / blob mới
    useEffect(() => {
        return () => {
            if (tempUrl?.startsWith("blob:")) URL.revokeObjectURL(tempUrl);
        };
    }, [tempUrl]);

    useEffect(() => {
        // khi value rỗng -> clear blob preview
        if (!value && onUploadToServer) {
            if (tempUrl?.startsWith("blob:")) URL.revokeObjectURL(tempUrl);
            setTempUrl(null);
        }
    }, [value]);

    const handleFiles = useCallback(
        async (files: FileList | null) => {
            if (!files?.length || locked) return;

            const file = files[0];
            if (!file.type?.startsWith?.("image/")) return;

            // Tạo preview trước
            const url = URL.createObjectURL(file);
            console.log({ url });
            setTempUrl((old) => {
                if (old?.startsWith("blob:")) URL.revokeObjectURL(old);
                return url;
            });

            // Nếu không truyền isUploading, tự quản lý pending cục bộ
            if (isUploading === undefined) setLocalPending(true);

            // Gửi hình lên server
            if (onUploadToServer && onSuccessToServer) {
                try {
                    const publicId = await onUploadToServer(file);
                    onSuccessToServer(publicId);
                } catch (err) {
                    // rollback preview
                    if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
                    setTempUrl(null);
                    onUploadError?.(err);
                } finally {
                    if (isUploading === undefined) setLocalPending(false);
                }
            }

            // Chỉ show hình không up lên server
            if (onUploadToLocal) {
                onUploadToLocal(file);
                if (isUploading === undefined) setLocalPending(false);
            }
        },
        [locked, isUploading, onUploadToServer, onSuccessToServer, onUploadError]
    );

    const onDeleteClick = async (e: React.MouseEvent) => {
        if (locked) return;
        e.stopPropagation();

        if (tempUrl?.startsWith("blob:")) URL.revokeObjectURL(tempUrl);
        setTempUrl(null);
        onSuccessToServer?.(""); // xoá publicId khỏi form

        try {
            await onDelete?.();
        } catch {
            // tuỳ bạn xử lý toast
        }
    };

    const onClick = () => {
        if (!locked) inputRef.current?.click();
    };

    const onDragOver = (e: React.DragEvent) => {
        if (locked) return;
        e.preventDefault();
        setDragActive(true);
    };
    const onDragLeave = (e: React.DragEvent) => {
        if (locked) return;
        e.preventDefault();
        setDragActive(false);
    };
    const onDrop = (e: React.DragEvent) => {
        if (locked) return;
        e.preventDefault();
        setDragActive(false);
        handleFiles(e.dataTransfer.files);
    };

    return (
        <div
            onClick={onClick}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
            className={cn(
                "flex items-center justify-center  relative select-none border",
                locked ? "cursor-not-allowed" : "cursor-pointer",
                !displayUrl && "border-dashed",
                dragActive ? "border-primary bg-primary/5" : "border-ring",
                variant === "round" ? "rounded-full overflow-hidden" : "rounded-2xl",
                className
            )}
        >
            <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => handleFiles(e.target.files)} />

            {displayUrl ? (
                <div className={cn(`w-full h-full`, variant === "round" ? "p-0" : "p-1")}>
                    <div className="relative w-full h-full group">
                        <Image src={displayUrl} alt="Preview" fill className="object-cover rounded-xl" sizes="(max-width: 768px) 100vw, 50vw" />
                        {pending ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                                <Loader2 className="h-4 w-4 animate-spin text-[white]" />
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button type="button" variant="outline" onClick={onDeleteClick} size="icon" className="size-8">
                                    <Trash />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-2 p-5 text-center">
                    <ImageIcon className="text-muted-foreground size-10" />
                    {title && <p className="text-lg font-semibold text-muted-foreground">{title}</p>}
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>
            )}
        </div>
    );
}
