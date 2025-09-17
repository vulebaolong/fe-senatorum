"use client";

import { Palette } from "lucide-react";

import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import ThemeToggleV2 from "../theme-toggle/theme-toggle-v2";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function NavMain() {
    const { isMobile, state } = useSidebar();
    const router = useRouter();
    const info = useAppSelector((state) => state.user.info);

    return (
        <>
            <SidebarGroup>
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
            {/* <SidebarGroup>
                <SidebarGroupLabel>Chapter</SidebarGroupLabel>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={() => router.push(ROUTER_CLIENT.CHAPTER_CREATE)}
                            className="items-center justify-center border"
                            variant={"outline"}
                            tooltip={"Create chapter"}
                        >
                            <span>Create chapter</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>
            <SidebarGroup>
                <SidebarGroupLabel>Collection</SidebarGroupLabel>
                <SidebarMenu>
                    {collections.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton className="items-center justify-center border" variant={"outline"} tooltip={item.title}>
                                <span>{item.title}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup> */}
        </>
    );
}
