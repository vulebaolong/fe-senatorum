"use client";

import { useUpsertThumbnail } from "@/api/tantask/image.tanstack";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Image as ImageIcon, Loader2, Trash } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type TProps = {
    value?: string | null; // luôn là publicId
    onChange: (val: string) => void; // ghi vào form
    toUrl: (publicId: string) => string; // bắt buộc: build URL từ publicId
};

export default function Thumbnail({ value, onChange, toUrl }: TProps) {
    const upsertThumbnail = useUpsertThumbnail();
    const [dragActive, setDragActive] = useState(false);
    const [tempUrl, setTempUrl] = useState<string | null>(null); // blob preview
    const inputRef = useRef<HTMLInputElement>(null);

    const displayUrl = tempUrl || (value ? toUrl(value) : null);

    // cleanup blob khi unmount / blob mới
    useEffect(() => {
        return () => {
            if (tempUrl?.startsWith("blob:")) URL.revokeObjectURL(tempUrl);
        };
    }, [tempUrl]);

    const handleFiles = useCallback(
        (files: FileList | null) => {
            if (!files?.length) return;
            const file = files[0];
            if (!file.type.startsWith("image/")) return;

            const url = URL.createObjectURL(file);
            setTempUrl((old) => {
                if (old?.startsWith("blob:")) URL.revokeObjectURL(old);
                return url;
            });

            const formData = new FormData();
            formData.append("thumbnail", file);
            upsertThumbnail.mutate(formData, {
                onSuccess: (publicId) => {
                    onChange(publicId); // form.thumbnail = publicId
                },
                onError: () => {
                    if (tempUrl?.startsWith("blob:")) URL.revokeObjectURL(tempUrl);
                    setTempUrl(null);
                },
            });
        },
        [upsertThumbnail, onChange, tempUrl]
    );

    const onDelete = (e: React.MouseEvent) => {
        if (upsertThumbnail.isPending) return;
        e.stopPropagation();
        if (tempUrl?.startsWith("blob:")) URL.revokeObjectURL(tempUrl);
        setTempUrl(null);
        onChange(""); // xoá publicId trong form
    };

    const onClick = () => {
        if (!upsertThumbnail.isPending) inputRef.current?.click();
    };

    const onDragOver = (e: React.DragEvent) => {
        if (upsertThumbnail.isPending) return;
        e.preventDefault();
        setDragActive(true);
    };
    const onDragLeave = (e: React.DragEvent) => {
        if (upsertThumbnail.isPending) return;
        e.preventDefault();
        setDragActive(false);
    };
    const onDrop = (e: React.DragEvent) => {
        if (upsertThumbnail.isPending) return;
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
                "flex items-center justify-center rounded-2xl h-[300px] relative select-none",
                upsertThumbnail.isPending ? "cursor-not-allowed" : "cursor-pointer",
                `border ${!displayUrl && "border-dashed"}`,
                dragActive ? "border-primary bg-primary/5" : "border-ring"
            )}
        >
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />

            {displayUrl ? (
                <div className="w-full h-full p-1">
                    <div className="relative w-full h-full group">
                        <Image src={displayUrl} alt="Preview" fill className="object-cover rounded-xl" sizes="(max-width: 768px) 100vw, 50vw" />
                        {upsertThumbnail.isPending ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
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
