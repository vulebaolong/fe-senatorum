"use client";

import { Plus } from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav/nav-main";
import { NavUser } from "@/components/nav/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { isMobile, state } = useSidebar();

    return (
        <Sidebar collapsible="icon" {...props} className="h-[calc(100svh-var(--header-height))] bottom-0 top-[var(--header-height)]">
            <SidebarHeader className={"items-center"}>
                <div className={cn("flex justify-between align-center w-full transition-all duration-200 ease-linear", "group-data-[collapsible=icon]:justify-center")}>
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
                        <TooltipContent side="right" align="center" hidden={state !== "collapsed" || isMobile}>
                            <p>Theme</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
                <Button
                    className={cn(
                        "flex items-center justify-center gap-2 h-8 w-full overflow-hidden px-3 py-2 transition-all duration-200 ease-linear",
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
            </SidebarHeader>
            <SidebarContent>
                <NavMain />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
