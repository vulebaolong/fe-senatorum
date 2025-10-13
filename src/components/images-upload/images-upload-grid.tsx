"use client";

import { Button } from "@/components/ui/button";
import { NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY } from "@/constant/app.constant";
import { cn } from "@/lib/utils";
import { Loader2, Plus, Trash } from "lucide-react";
import Image from "next/image";
import * as React from "react";

type UploadFunction = (file: File) => Promise<string>;

export type ImageItem = {
    id: string;
    localBlobUrl: string | null;
    serverUrl: string | null;
    uploading: boolean;
    error?: string;
};

export type ImagesUploadGridProps = {
    onUploadToServer?: UploadFunction; // bắt buộc: trả về URL/publicId sau khi upload
    initialServerUrls?: ImageItem[]; // nếu đã có ảnh server sẵn (ví dụ khi edit bài)
    // chỉ show không up server
    onUploadToLocal?: (files: File[]) => void; // chỉ show hình
    onChange?: (serverUrls: string[]) => void; // gọi mỗi lần danh sách URL server thay đổi
    onDelete?: (serverUrls: string) => void; // danh sách URL server đã hoàn tất
    disabled?: boolean;
    accept?: string; // mặc định image/*
    maxCount?: number; // mặc định 10
    className?: string;
    title?: string;
    description?: string;
};

export default function ImagesUploadGrid({
    onUploadToServer,
    onUploadToLocal,
    initialServerUrls = [],
    onChange,
    onDelete,
    disabled,
    accept = "image/*",
    maxCount = 10,
    className,
    title = "Upload photos",
    description,
}: ImagesUploadGridProps) {
    const inputReference = React.useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = React.useState(false);

    // Khởi tạo danh sách từ server (nếu có)
    const [imageItems, setImageItems] = React.useState<ImageItem[]>(initialServerUrls);

    // Dọn blob khi unmount
    React.useEffect(() => {
        return () => {
            imageItems.forEach((item) => {
                if (item.localBlobUrl?.startsWith("blob:")) URL.revokeObjectURL(item.localBlobUrl);
            });
        };
    }, [imageItems]);

    // Gửi danh sách URL server ra ngoài mỗi lần thay đổi
    React.useEffect(() => {
        onChange?.(imageItems.filter((it) => !!it.serverUrl).map((it) => it.serverUrl!));
    }, [imageItems, onChange]);

    const isUploadingAny = imageItems.some((it) => it.uploading);
    const totalCount = imageItems.length;
    const isLocked = disabled || totalCount >= maxCount;

    const openFileDialog = () => {
        if (!isLocked) inputReference.current?.click();
    };

    const handleFiles = async (fileList: FileList | null) => {
        if (!fileList?.length || isLocked) return;

        const remaining = Math.max(0, maxCount - totalCount);
        const files = Array.from(fileList)
            .filter((file) => file.type?.startsWith("image/"))
            .slice(0, remaining);

        if (files.length === 0) return;

        // Tạo item preview local ngay lập tức
        const newItems: ImageItem[] = files.map((file) => ({
            id: generateStableId(),
            localBlobUrl: URL.createObjectURL(file),
            serverUrl: null,
            // uploading: true,
            uploading: !!onUploadToServer ? true : false,
        }));

        // Render local trước
        setImageItems((prev) => [...prev, ...newItems]);

        if (onUploadToLocal) {
            onUploadToLocal(files);
        }

        if (onUploadToServer) {
            // Upload song song (mỗi file một promise), cập nhật từng item
            await Promise.all(
                newItems.map(async (newItem, index) => {
                    const file = files[index];
                    try {
                        const serverUrl = await onUploadToServer(file);
                        setImageItems((prev) =>
                            prev.map((it) =>
                                it.id === newItem.id
                                    ? {
                                          ...it,
                                          serverUrl,
                                          uploading: false,
                                          // dọn blob để tránh memory leak
                                          localBlobUrl: it.localBlobUrl?.startsWith("blob:")
                                              ? (URL.revokeObjectURL(it.localBlobUrl), null)
                                              : it.localBlobUrl,
                                      }
                                    : it
                            )
                        );
                    } catch (error: any) {
                        setImageItems((prev) =>
                            prev.map((it) => (it.id === newItem.id ? { ...it, uploading: false, error: error?.message || "Upload failed" } : it))
                        );
                    }
                })
            );
        }
    };

    const handleDelete = (id: string) => {
        if (disabled) return;
        setImageItems((prev) => {
            const item = prev.find((x) => x.id === id);
            onDelete?.(item?.serverUrl!);
            if (item?.localBlobUrl?.startsWith("blob:")) URL.revokeObjectURL(item.localBlobUrl);
            return prev.filter((x) => x.id !== id);
        });
    };

    // Drag & drop
    const onDragOver = (event: React.DragEvent) => {
        if (isLocked) return;
        event.preventDefault();
        setIsDragOver(true);
    };
    const onDragLeave = (event: React.DragEvent) => {
        if (isLocked) return;
        event.preventDefault();
        setIsDragOver(false);
    };
    const onDrop = (event: React.DragEvent) => {
        if (isLocked) return;
        event.preventDefault();
        setIsDragOver(false);
        handleFiles(event.dataTransfer.files);
    };

    return (
        <div className={cn("space-y-3", className)}>
            {/* Khu vực kéo-thả / chọn file */}
            <div
                role="button"
                tabIndex={0}
                onClick={openFileDialog}
                onKeyDown={(event) => (event.key === "Enter" || event.key === " ") && openFileDialog()}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={cn(
                    "flex items-center justify-center gap-2 border rounded-xl px-4 py-8 text-sm",
                    isLocked ? "cursor-not-allowed opacity-70" : "cursor-pointer",
                    isDragOver ? "border-primary bg-primary/5" : "border-border"
                )}
                aria-disabled={isLocked}
            >
                <Plus className="h-4 w-4" />
                <span>{isLocked ? `Maximum ${maxCount} photos` : isUploadingAny ? "Uploading..." : title}</span>
                {description && !isUploadingAny && <span className="text-muted-foreground ml-2">{description}</span>}
                <input ref={inputReference} type="file" accept={accept} multiple onChange={(e) => handleFiles(e.target.files)} className="hidden" />
            </div>

            {/* Lưới ảnh */}
            {imageItems.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {imageItems.map((item, index) => {
                        const displayUrl = (item.serverUrl && `${NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY}/${item.serverUrl}`) || item.localBlobUrl || "";
                        return (
                            <div key={item.id} className="relative aspect-square overflow-hidden rounded-xl group">
                                {displayUrl && (
                                    <Image
                                        src={displayUrl}
                                        alt={`image-${index}`}
                                        fill
                                        className="object-cover"
                                        sizes="200px"
                                        priority={index === 0}
                                    />
                                )}

                                {/* Overlay loading khi đang upload */}
                                {item.uploading && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                                    </div>
                                )}

                                {/* Trạng thái lỗi (nếu có) */}
                                {item.error && !item.uploading && (
                                    <div className="absolute inset-0 bg-red-600/30 backdrop-blur-[1px] flex items-center justify-center px-2 text-center">
                                        <span className="text-white text-xs">Upload failed</span>
                                    </div>
                                )}

                                {/* Nút xóa (ẩn khi đang upload) */}
                                {!item.uploading && (
                                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function generateStableId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
