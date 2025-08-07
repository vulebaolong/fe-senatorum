"use client";

import { useUploadImageDraft } from "@/api/tantask/image.tanstack";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Image as ImageIcon, Loader2, Trash } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";

type TProps = {
    onUploadThumbnail: (publicId: string) => void;
    preview: string | null
    setPreview: Dispatch<SetStateAction<string | null>>
};

export default function Thumbnail({ onUploadThumbnail, preview, setPreview }: TProps) {
    const uploadImageDraft = useUploadImageDraft();

    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // gán ảnh được chọn/kéo vào
    const handleFiles = useCallback(
        (files: FileList | null) => {
            if (!files || files.length === 0) return;

            const file = files[0];

            if (!file.type.startsWith("image/")) return;

            // Cập nhật preview và meta
            const url = URL.createObjectURL(file);
            setPreview((old) => {
                if (old) URL.revokeObjectURL(old);
                return url;
            });

            const formData = new FormData();
            formData.append("draft", file);
            uploadImageDraft.mutate(formData, {
                onSuccess: (publicId) => {
                    onUploadThumbnail(publicId);
                },
            });
        },
        [uploadImageDraft, onUploadThumbnail]
    );

    // cleanup khi unmount
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    // drag events
    const onDragOver = (e: React.DragEvent) => {
        if (uploadImageDraft.isPending) return;
        e.preventDefault();
        setDragActive(true);
    };
    const onDragLeave = (e: React.DragEvent) => {
        if (uploadImageDraft.isPending) return;
        e.preventDefault();
        setDragActive(false);
    };
    const onDrop = (e: React.DragEvent) => {
        if (uploadImageDraft.isPending) return;
        e.preventDefault();
        setDragActive(false);
        handleFiles(e.dataTransfer.files);
    };

    const onDelete = (e: React.MouseEvent) => {
        if (uploadImageDraft.isPending) return;
        e.stopPropagation();

        setPreview((old) => {
            if (old) URL.revokeObjectURL(old);
            return null;
        });
    };

    const onClick = () => {
        if (uploadImageDraft.isPending) return;
        inputRef.current?.click();
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
                "flex items-center justify-center rounded-2xl h-[300px]",
                "relative select-none",
                uploadImageDraft.isPending ? "cursor-not-allowed" : "cursor-pointer",
                `border ${!preview && "border-dashed"}`,
                dragActive ? "border-primary bg-primary/5" : "border-ring"
            )}
        >
            {/* input file ẩn đi, click vào khung sẽ kích hoạt */}
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />

            {preview ? (
                <div className="w-full h-full p-1">
                    <div className="relative w-full h-full group">
                        {/* Ảnh preview */}
                        <Image src={preview} alt="Preview" fill className="object-cover rounded-xl" sizes="(max-width: 768px) 100vw, 50vw" />

                        {uploadImageDraft.isPending ? (
                            // Overlay loading khi đang upload
                            <div
                                className={cn(
                                    "absolute inset-0 flex items-center justify-center",
                                    "bg-black/50 rounded-xl ",
                                    "transition-opacity duration-300"
                                )}
                            >
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            </div>
                        ) : (
                            // Overlay + nút xoá
                            <div
                                className={cn(
                                    "absolute inset-0 flex items-center justify-center",
                                    "bg-black/20 rounded-xl",
                                    "opacity-0 group-hover:opacity-100",
                                    "transition-opacity duration-300"
                                )}
                            >
                                <Button type="button" variant="outline" onClick={onDelete} size="icon" className="size-8">
                                    <Trash />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-2 p-5 text-center">
                    <ImageIcon size={50} className="text-muted-foreground" />
                    <p className="text-lg font-semibold text-muted-foreground">Add a featured image</p>
                    <p className="text-sm text-muted-foreground">Drag and drop an image, or click to browse</p>
                </div>
            )}
        </div>
    );
}
