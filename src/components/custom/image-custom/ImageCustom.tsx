"use client";

import { StaticImageData, StaticRequire } from "next/dist/shared/lib/get-img-props";
import Image, { ImageProps } from "next/image";
import { useState } from "react";
import type { CSSProperties } from "react";

type AppImageProps = {
    alt?: string;
    fallbackSrc?: string;
    priority?: boolean;
    style?: CSSProperties;
    objectFit?: CSSProperties["objectFit"];
    className?: string;
} & Omit<ImageProps, "fill" | "width" | "height">;

export function isValidImageSrc(src: string | StaticRequire | StaticImageData | null | undefined): boolean {
    if (!src) return false;

    // StaticImageData: object có src property
    if (typeof src === "object") {
        if ("src" in src && typeof src.src === "string") {
            return true;
        }
        return false;
    }

    // StaticRequire: require("./img.png") → typeof src === 'object' cũng match ở trên

    // String: URL tuyệt đối hoặc path bắt đầu bằng /
    if (typeof src === "string") {
        // Cho phép ảnh nội bộ
        if (src.startsWith("/")) return true;

        // Cho phép URL hợp lệ
        try {
            new URL(src);
            return true;
        } catch {
            return false;
        }
    }

    return false;
}

export default function ImageCustom({
    alt = "",
    fallbackSrc = "/images/fallback-image.png", // nhớ để path public
    priority = false,
    style = {},
    objectFit = "cover",
    className = "",
    ...props
}: AppImageProps) {
    const [src, setSrc] = useState(props.src && isValidImageSrc(props.src) ? props.src : fallbackSrc);

    return (
        <Image
            {...props}
            alt={alt}
            src={src}
            width={0}
            height={0}
            sizes="100vw"
            priority={priority}
            className={className}
            style={{
                width: "100%",
                height: "100%",
                objectFit,
                display: "block",
                ...style,
            }}
            onError={() => {
                if (src !== fallbackSrc) {
                    setSrc(fallbackSrc);
                }
            }}
        />
    );
}
