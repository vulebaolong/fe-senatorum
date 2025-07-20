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

const navMain = [
    {
        title: "Playground",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [
            {
                title: "History",
                url: "#",
            },
            {
                title: "Starred",
                url: "#",
            },
            {
                title: "Settings",
                url: "#",
            },
        ],
    },
    {
        title: "Models",
        url: "#",
        icon: Bot,
        items: [
            {
                title: "Genesis",
                url: "#",
            },
            {
                title: "Explorer",
                url: "#",
            },
            {
                title: "Quantum",
                url: "#",
            },
        ],
    },
    {
        title: "Documentation",
        url: "#",
        icon: BookOpen,
        items: [
            {
                title: "Introduction",
                url: "#",
            },
            {
                title: "Get Started",
                url: "#",
            },
            {
                title: "Tutorials",
                url: "#",
            },
            {
                title: "Changelog",
                url: "#",
            },
        ],
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
            {
                title: "General",
                url: "#",
            },
            {
                title: "Team",
                url: "#",
            },
            {
                title: "Billing",
                url: "#",
            },
            {
                title: "Limits",
                url: "#",
            },
        ],
    },
];

export function NavMain() {
    const { isMobile, state } = useSidebar();
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
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
                {navMain.map((item) => (
                    <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton tooltip={item.title}>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {item.items?.map((subItem) => (
                                        <SidebarMenuSubItem key={subItem.title}>
                                            <SidebarMenuSubButton asChild>
                                                <a href={subItem.url}>
                                                    <span>{subItem.title}</span>
                                                </a>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
