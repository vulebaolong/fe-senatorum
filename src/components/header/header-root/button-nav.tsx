"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileText, House, Zap } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
    { href: "/", icon: House },
    { href: "/post", icon: Zap },
    { href: "/article", icon: FileText },
    // { href: "/images", icon: Image },
    // { href: "/videos", icon: Video },
    // { href: "/users", icon: Users },
];

const width = "w-18";

export default function ButtonNav() {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <div className="relative flex justify-around gap-2">
            {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                    <Button
                        key={item.href}
                        size="icon-lg"
                        variant="ghost"
                        className={cn(
                            "relative flex flex-col items-center transition-colors duration-200",
                            "focus-visible:!outline-none focus-visible:!border-none focus-visible:!ring-0",
                            width,
                            isActive ? "text-blue-400" : "text-gray-400"
                        )}
                        onClick={() => {
                            router.push(item.href);
                        }}
                    >
                        <Icon className="!w-5 !h-5 font-bold"/>
                        <div
                            className={cn(
                                width,
                                "absolute bottom-0 h-[2px] rounded-full bg-blue-500 transition-all duration-300",
                                isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                            )}
                        />
                    </Button>
                );
            })}
        </div>
    );
}
