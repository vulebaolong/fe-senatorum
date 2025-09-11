"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type TProps = {
    name: string;
    username: string;
    className?: string;
};

export default function Name({ name, username, className }: TProps) {
    const router = useRouter();

    return (
        <p
            onClick={(e) => {
                e.stopPropagation();
                router.push(`/${username}`);
            }}
            className={cn("text-sm truncate font-semibold leading-none cursor-pointer hover:underline w-fit", className)}
        >
            {name}
        </p>
    );
}
