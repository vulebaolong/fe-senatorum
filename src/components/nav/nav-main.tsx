"use client";

import { Palette } from "lucide-react";

import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { useAppSelector } from "@/redux/store";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggleV2 from "../theme-toggle/theme-toggle-v2";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { navItems } from "../header/header-root/button-nav";
import { cn } from "@/lib/utils";

export function NavMain() {
    const { isMobile, state } = useSidebar();
    const router = useRouter();
    const info = useAppSelector((state) => state.user.info);
    const pathname = usePathname();

    return (
        <>
            <SidebarGroup className="flex md:hidden">
                <SidebarMenu>
                    {navItems.map((item, index) => {
                        const Icon = item.icon;
                        // const isActive = pathname === item.href;
                        return (
                            <SidebarMenuItem key={index}>
                                <SidebarMenuButton
                                    onClick={() => {
                                        router.push(item.href);
                                    }}
                                    className="items-center justify-center border"
                                    variant={"outline"}
                                    tooltip={item.label}
                                >
                                    <Icon className={cn("!w-[12px] !h-[12px] font-bold")} />
                                    <span>{item.label}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
                <SidebarMenu>
                    {info && (
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                onClick={() => {
                                    if (info?.name) {
                                        router.push(`/${info?.username}#my-article`);
                                    } else {
                                        console.log("info?.name is null");
                                    }
                                }}
                                className="items-center justify-center border"
                                variant={"outline"}
                                tooltip={"My Article"}
                            >
                                <span>My Article</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup className="mt-auto">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex items-center overflow-hidden">
                                    <div className="p-2">
                                        <Palette className="size-4 shrink-0 " />
                                    </div>
                                    <span className="text-sm">{`Theme`}</span>
                                    <ThemeToggleV2 className="ml-auto" />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="right" align="center" hidden={state !== "collapsed" || isMobile}>
                                <p>Theme</p>
                            </TooltipContent>
                        </Tooltip>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>
        </>
    );
}
