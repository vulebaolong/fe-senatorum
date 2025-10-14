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

export default function ButtonNav() {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <div className="relative flex justify-around">
            {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                    <Button
                        key={item.href}
                        size="icon"
                        variant="ghost"
                        className={cn(
                            "relative flex flex-col items-center transition-colors duration-200",
                            "focus-visible:!outline-none focus-visible:!border-none focus-visible:!ring-0",
                            isActive ? "text-blue-400" : "text-gray-400"
                        )}
                        onClick={() => {
                            router.push(item.href);
                        }}
                    >
                        <Icon />
                        <div
                            className={cn(
                                "absolute bottom-0 h-[2px] w-9 rounded-full bg-blue-500 transition-all duration-300",
                                isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                            )}
                        />
                    </Button>
                );
            })}
        </div>
    );
}
