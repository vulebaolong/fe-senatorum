"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ROUTER_CLIENT } from "@/constant/router.constant";
import { cn } from "@/lib/utils";
import { SET_OPEN_CREATE_POST_DIALOG } from "@/redux/slices/setting.slice";
import { useAppDispatch } from "@/redux/store";
import { FileText, Image, Plus, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSidebar } from "../ui/sidebar";

export function NavButtonCreate() {
    const router = useRouter();
    const { setOpen, setOpenMobile } = useSidebar();
    const dispatch = useAppDispatch();

    return (
        <Tooltip>
            <DropdownMenu>
                {/* <TooltipTrigger asChild> */}
                <DropdownMenuTrigger asChild>
                    <Button
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
                            Create
                        </span>
                    </Button>
                </DropdownMenuTrigger>
                {/* </TooltipTrigger> */}

                {/* <TooltipContent side="right" align="center">
                    <p>Create Post Or Article</p>
                </TooltipContent> */}

                <DropdownMenuContent align="start" side="right">
                    <DropdownMenuItem
                        onSelect={(e) => {
                            setOpen(false);
                            setOpenMobile(false);
                            dispatch(SET_OPEN_CREATE_POST_DIALOG(true));
                        }}
                    >
                        <Zap /> Post
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={() => {
                            setOpen(false);
                            setOpenMobile(false);
                            router.push(ROUTER_CLIENT.ARTICLE_CREATE);
                        }}
                    >
                        <FileText />
                        Article
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={() => {
                            setOpen(false);
                            setOpenMobile(false);
                            router.push(ROUTER_CLIENT.GALLERY_IMAGE_CREATE);
                        }}
                    >
                        <Image />
                        Image
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </Tooltip>
    );
}
