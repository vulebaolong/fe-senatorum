"use client";

import * as React from "react";
import { Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import FacebookCollage, { CollageItem } from "../facebook-collage/facebook-collage";

type UploadFunction = (file: File) => Promise<string>;

type ImagesUploadFacebookProperties = {
    onUploadToServer: UploadFunction; // bắt buộc: trả về URL/publicId sau khi upload
    initialServerUrls?: string[]; // nếu đang edit đã có ảnh
    onChange?: (serverUrls: string[]) => void; // danh sách URL server đã hoàn tất
    onDelete?: (serverUrls: string) => void; // danh sách URL server đã hoàn tất
    disabled?: boolean;
    accept?: string;
    maxCount?: number;
    className?: string;
    title?: string;
    description?: string;
};

export default function ImagesUpload({
    onUploadToServer,
    initialServerUrls = [],
    onChange,
    onDelete,
    disabled,
    accept = "image/*",
    maxCount = 10,
    className,
    title = "Click or drag images here",
    description,
}: ImagesUploadFacebookProperties) {
    const fileInputReference = React.useRef<HTMLInputElement>(null);
    const [isDraggingOver, setIsDraggingOver] = React.useState(false);

    const [items, setItems] = React.useState<CollageItem[]>(
        () =>
            initialServerUrls.map((imageUrl) => ({
                id: generateStableId(),
                localBlobUrl: null,
                serverUrl: imageUrl,
                uploading: false,
            })) || []
    );

    React.useEffect(() => {
        onChange?.(items.filter((x) => !!x.serverUrl).map((x) => x.serverUrl!));
    }, [items, onChange]);

    React.useEffect(() => {
        return () => {
            items.forEach((it) => {
                if (it.localBlobUrl?.startsWith("blob:")) URL.revokeObjectURL(it.localBlobUrl);
            });
        };
    }, [items]);

    const isUploadingAny = items.some((x) => x.uploading);
    const totalCount = items.length;
    const isLocked = disabled || totalCount >= maxCount;

    const openFileDialog = () => {
        if (!isLocked) fileInputReference.current?.click();
    };

    const handleFiles = async (fileList: FileList | null) => {
        if (!fileList?.length || isLocked) return;

        const remainingSlots = Math.max(0, maxCount - totalCount);
        const selectedFiles = Array.from(fileList)
            .filter((file) => file.type?.startsWith("image/"))
            .slice(0, remainingSlots);

        if (selectedFiles.length === 0) return;

        // Hiển thị ngay preview local + overlay upload
        const newItems: CollageItem[] = selectedFiles.map((file) => ({
            id: generateStableId(),
            localBlobUrl: URL.createObjectURL(file),
            serverUrl: null,
            uploading: true,
        }));
        setItems((previous) => [...previous, ...newItems]);

        // Upload song song từng file, xong đâu gỡ overlay đó và thay URL server
        await Promise.all(
            newItems.map(async (newItem, index) => {
                const file = selectedFiles[index];
                try {
                    const serverUrl = await onUploadToServer(file);
                    setItems((previous) =>
                        previous.map((it) =>
                            it.id === newItem.id
                                ? {
                                      ...it,
                                      serverUrl,
                                      uploading: false,
                                      localBlobUrl:
                                          it.localBlobUrl && it.localBlobUrl.startsWith("blob:")
                                              ? (URL.revokeObjectURL(it.localBlobUrl), null)
                                              : it.localBlobUrl,
                                  }
                                : it
                        )
                    );
                } catch (error) {
                    // Thất bại: giữ preview local nhưng tắt overlay để người dùng biết đã dừng
                    setItems((previous) => previous.map((it) => (it.id === newItem.id ? { ...it, uploading: false } : it)));
                }
            })
        );
    };

    const handleDeleteAtIndex = (indexToRemove: number) => {
        if (disabled) return;
        setItems((previous) => {
            const target = previous[indexToRemove];
            onDelete?.(target.serverUrl!);
            if (target?.localBlobUrl?.startsWith("blob:")) URL.revokeObjectURL(target.localBlobUrl);
            const next = previous.filter((_, index) => index !== indexToRemove);
            return next;
        });
    };

    // Drag & drop (giống ImagesUploadGrid)
    const onDragOver = (event: React.DragEvent) => {
        if (isLocked) return;
        event.preventDefault();
        setIsDraggingOver(true);
    };
    const onDragLeave = (event: React.DragEvent) => {
        if (isLocked) return;
        event.preventDefault();
        setIsDraggingOver(false);
    };
    const onDrop = (event: React.DragEvent) => {
        if (isLocked) return;
        event.preventDefault();
        setIsDraggingOver(false);
        handleFiles(event.dataTransfer.files);
    };

    return (
        <div className={cn("space-y-3", className)}>
            {/* Khu vực kéo-thả / click chọn file (giống ImagesUploadGrid) */}
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
                    isLocked ? "cursor-not-allowed opacity-75" : "cursor-pointer",
                    isDraggingOver ? "border-primary bg-primary/5" : "border-border"
                )}
                aria-disabled={isLocked}
            >
                <Plus className="h-4 w-4" />
                <span>{isLocked ? `Maximum ${maxCount} photos` : isUploadingAny ? "Uploading..." : title}</span>
                {description && !isUploadingAny && <span className="text-muted-foreground ml-2">{description}</span>}
                <input
                    ref={fileInputReference}
                    type="file"
                    accept={accept}
                    multiple
                    onChange={(event) => handleFiles(event.target.files)}
                    className="hidden"
                />
            </div>

            {/* Lưới kiểu Facebook */}
            {items.length > 0 && (
                <div className="relative">
                    <FacebookCollage items={items} />

                    {/* Nút xoá từng ảnh (theo chỉ mục trong mảng hiện tại) */}
                    <div className="mt-2 flex flex-wrap gap-2">
                        {items.map((item, index) => (
                            <Button
                                key={item.id}
                                type="button"
                                size="sm"
                                variant="secondary"
                                onClick={() => handleDeleteAtIndex(index)}
                                disabled={item.uploading || disabled}
                                className="gap-2"
                            >
                                <Trash className="h-4 w-4" />
                                Remove #{index + 1}
                            </Button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export function generateStableId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
