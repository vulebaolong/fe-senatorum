"use client";

import * as React from "react";

import { NavMain } from "@/components/nav/nav-main";
import { NavUser } from "@/components/nav/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/store";
import { SidebarTrigger } from "../custom/sidebar-custom";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { NavButtonCreate } from "./nav-button-create";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { open } = useSidebar();
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
                <NavButtonCreate />
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
