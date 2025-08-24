"use client";

import { LOGO } from "@/constant/app.constant";
import useRouter from "@/hooks/use-router-custom";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { DetailedHTMLProps, HTMLAttributes } from "react";

type TProps = {
    aspectRatio?: string;
    src?: string;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export function Logo({ className, src = LOGO, ...props }: TProps) {
    const router = useRouter();

    const handleClickLogo = () => {
        router.push("/");
    };

    return (
        <div onClick={handleClickLogo} className={cn("cursor-pointer w-[40px] h-[40px] aspect-[1/1]", className)} {...props}>
            <Image
                src={src}
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                alt="product-image"
                priority={true}
            />
        </div>
    );
}
