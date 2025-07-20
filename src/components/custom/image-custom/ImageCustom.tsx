"use client";

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

export default function ImageCustom({
    alt = "",
    fallbackSrc = "/fallback-image.png", // <- fallback mặc định nếu ảnh lỗi
    priority = false,
    style = {},
    objectFit = "cover",
    className = "",
    ...props
}: AppImageProps) {
    const [src, setSrc] = useState(props.src);

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
