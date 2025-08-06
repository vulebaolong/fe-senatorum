"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Image as ImageIcon, Trash } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Thumbnail() {
    const [preview, setPreview] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // gán ảnh được chọn/kéo vào
    const handleFiles = useCallback((files: FileList | null) => {
        if (!files || files.length === 0) return;
        const file = files[0];
        if (!file.type.startsWith("image/")) return;
        const url = URL.createObjectURL(file);
        setPreview((old) => {
            if (old) URL.revokeObjectURL(old);
            return url;
        });
        // TODO: bạn có thể lưu cả file vào form state tại đây nếu cần
    }, []);

    // cleanup khi unmount
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    // drag events
    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(true);
    };
    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
    };
    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        handleFiles(e.dataTransfer.files);
    };

    return (
        <div
            onClick={() => inputRef.current?.click()}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
            className={cn(
                "flex items-center justify-center rounded-2xl h-[300px] cursor-pointer",
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
                        <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-xl" />

                        {/* Overlay + nút xoá */}
                        <div
                            className="absolute inset-0 flex items-center justify-center 
               bg-black/20 rounded-xl 
               opacity-0 group-hover:opacity-100 
               transition-opacity duration-300"
                        >
                            <Button
                                type="button"
                                variant="outline"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setPreview((old) => {
                                        if (old) URL.revokeObjectURL(old);
                                        return null;
                                    });
                                }}
                                size="icon"
                                className="size-8"
                            >
                                <Trash />
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-2 p-5 text-center">
                    <ImageIcon size={50} />
                    <p className="text-lg font-semibold">Add a featured image</p>
                    <p className="text-sm text-muted-foreground">Drag and drop an image, or click to browse</p>
                </div>
            )}
        </div>
    );
}
