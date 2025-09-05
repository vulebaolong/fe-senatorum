"use client";

import { StaticImageData, StaticRequire } from "next/dist/shared/lib/get-img-props";
import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";

export type AppImageProps = {
    alt?: string;
    fallbackSrc?: string;
    priority?: boolean;
    style?: React.CSSProperties;
    objectFit?: React.CSSProperties["objectFit"];
    className?: string;
} & Omit<ImageProps, "fill" | "width" | "height">;

function isValidImageSrc(src: string | StaticRequire | StaticImageData | null | undefined): boolean {
    if (!src) return false;

    if (typeof src === "object") {
        // StaticImageData
        return "src" in (src as any) && typeof (src as any).src === "string";
    }

    if (typeof src === "string") {
        if (src.startsWith("/") || src.startsWith("blob:") || src.startsWith("data:")) return true;
        try {
            new URL(src); // absolute http(s)
            return true;
        } catch {
            return false;
        }
    }
    return false;
}

export default function ImageCustom({
    alt = "",
    fallbackSrc = "/images/fallback-image.png",
    priority = false,
    style = {},
    objectFit = "cover",
    className = "",
    ...props
}: AppImageProps) {
    const compute = (v: any) => (isValidImageSrc(v) ? v : fallbackSrc);

    const [src, setSrc] = useState<any>(compute(props.src));

    useEffect(() => {
        setSrc(compute(props.src));
    }, [props.src, fallbackSrc]);

    // Optional: force remount khi URL đổi để tránh cache layout
    const key = typeof src === "string" ? src : (src as any)?.src ?? "img";

    return (
        <Image
            key={key}
            {...props}
            alt={alt}
            src={src}
            fill // dùng fill thay vì width=0 height=0
            sizes="100vw"
            priority={priority}
            className={className + " object-cover"}
            style={{ objectFit, display: "block", ...style }}
            // Nếu hình lỗi -> dùng fallback
            onError={() => {
                if (src !== fallbackSrc) setSrc(fallbackSrc);
            }}
            // Khi bạn dùng blob/data URL, thêm unoptimized để tránh pipeline optimize
            unoptimized={typeof src === "string" && (src.startsWith("blob:") || src.startsWith("data:"))}
        />
    );
}
