"use client";
import { BookOpen, Bot, Settings2, SquareTerminal } from "lucide-react";

import { ChevronRight, Palette } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from "@/components/ui/sidebar";
import ThemeToggleV2 from "../theme-toggle/theme-toggle-v2";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import useRouter from "@/hooks/use-router-custom";
import { ROUTER_CLIENT } from "@/constant/router.constant";

const groups = [
    {
        title: "Discover groups",
        url: "#",
    },
    {
        title: "Current group 1",
        url: "#",
    },
    {
        title: "Current group 2",
        url: "#",
    },
    {
        title: "New Group",
        url: "#",
    },
];

const collections = [
    {
        title: "Bookmarks",
        url: "#",
    },
    {
        title: "Custom collections 1",
        url: "#",
    },
    {
        title: "Custom collections 2",
        url: "#",
    },
    {
        title: "New Collection",
        url: "#",
    },
];

export function NavMain() {
    const { isMobile, state } = useSidebar();
    const router = useRouter();
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
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={() => {
                                router.push(ROUTER_CLIENT.ARTICLE_SELF);
                            }}
                            className="items-center justify-center border"
                            variant={"outline"}
                            tooltip={"My Article"}
                        >
                            <span>My Article</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>
            <SidebarGroup>
                <SidebarGroupLabel>Groups</SidebarGroupLabel>
                <SidebarMenu>
                    {groups.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton className="items-center justify-center border" variant={"outline"} tooltip={item.title}>
                                <span>{item.title}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>
            <SidebarGroup>
                <SidebarGroupLabel>My Collections</SidebarGroupLabel>
                <SidebarMenu>
                    {collections.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton className="items-center justify-center border" variant={"outline"} tooltip={item.title}>
                                <span>{item.title}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>
        </>
    );
}
