"use client";

import { Plus } from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav/nav-main";
import { NavUser } from "@/components/nav/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { ROUTER_CLIENT } from "@/constant/router.constant";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "../custom/sidebar-custom";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useAppSelector } from "@/redux/store";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { open } = useSidebar();
    const router = useRouter();
    const info = useAppSelector((state) => state.user.info);

    return (
        <Sidebar collapsible="icon" {...props} className="h-[calc(100svh-var(--header-height))] bottom-0 top-[var(--header-height)]">
            <SidebarHeader className={"items-center"}>
                <div
                    className={cn(
                        "h-[42px] items-center flex justify-between align-center w-full transition-all duration-200 ease-linear",
                        "group-data-[collapsible=icon]:justify-center"
                    )}
                >
                    <p
                        className={cn(
                            "text-sidebar-foreground/70 opacity-100 visible w-full ring-sidebar-ring flex h-8 items-center rounded-md text-xs font-medium transition-all duration-200 ease-linear overflow-hidden whitespace-nowrap",
                            "px-2",
                            "group-data-[collapsible=icon]:px-0",
                            "group-data-[collapsible=icon]:w-0",
                            "group-data-[collapsible=icon]:opacity-0",
                            "group-data-[collapsible=icon]:invisible"
                        )}
                    >
                        Menu
                    </p>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <SidebarTrigger />
                        </TooltipTrigger>
                        <TooltipContent side="right" align="center">
                            <p>{open ? "Close Sidebar" : "Open Sidebar"}</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            onClick={() => {
                                router.push(ROUTER_CLIENT.ARTICLE_CREATE);
                            }}
                            className={cn(
                                "flex items-center justify-center gap-2 h-8 w-full overflow-hidden px-3 py-2 transition-all duration-500",
                                "group-data-[collapsible=icon]:size-8",
                                "group-data-[collapsible=icon]:px-0",
                                "group-data-[collapsible=icon]:justify-center",
                                "group-data-[collapsible=icon]:gap-0"
                            )}
                        >
                            <Plus />
                            <span
                                className={cn(
                                    "whitespace-nowrap transition-all duration-200 ease-linear",
                                    "group-data-[collapsible=icon]:opacity-0",
                                    "group-data-[collapsible=icon]:w-0",
                                    "group-data-[collapsible=icon]:overflow-hidden"
                                )}
                            >
                                New Article
                            </span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">
                        <p>New Article</p>
                    </TooltipContent>
                </Tooltip>
            </SidebarHeader>
            <SidebarContent>
                <NavMain />
            </SidebarContent>
            {info && (
                <SidebarFooter>
                    <NavUser />
                </SidebarFooter>
            )}
        </Sidebar>
    );
}
