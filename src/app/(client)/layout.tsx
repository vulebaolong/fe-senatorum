"use client";

import { AppSidebar } from "@/components/nav/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { VERSION } from "@/constant/app.constant";
import { useSocket } from "@/hooks/socket.hook";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { SET_OPEN_CREATE_POST_DIALOG, SET_OPEN_EDIT_POST_DIALOG, SET_OPEN_VERSION_UPDATE_DIALOG } from "@/redux/slices/setting.slice";
import { TSocketRes } from "@/types/base.type";
import { useEffect } from "react";
import Header from "@/components/header/header-root/header";
import PostCreate from "@/components/post/post-create";

type TProps = {
    children: React.ReactNode;
};

export default function layout({ children }: TProps) {
    const { socket } = useSocket();
    const dispatch = useAppDispatch();
    const openCreatePostDialog = useAppSelector((state) => state.setting.openCreatePostDialog);
    const openEditPostDialog = useAppSelector((state) => state.setting.openEditPostDialog);

    useEffect(() => {
        if (!socket) return;

        const handleVersion = ({ data }: TSocketRes<any>) => {
            console.log({ data });
            if (data.version !== VERSION) {
                dispatch(SET_OPEN_VERSION_UPDATE_DIALOG(true));
            }
        };

        socket.on("version", handleVersion);
        return () => {
            socket.off("version", handleVersion);
        };
    }, [socket]);

    return (
        <>
            <SidebarProvider defaultOpen={false} className="pt-[var(--header-height)]">
                <Header />
                <AppSidebar />
                <SidebarInset>{children}</SidebarInset>
            </SidebarProvider>
            <PostCreate
                type="create"
                open={openCreatePostDialog}
                openOnchange={(e) => {
                    dispatch(SET_OPEN_CREATE_POST_DIALOG(e));
                }}
            />
            <PostCreate type="edit" open={openEditPostDialog} openOnchange={(e) => dispatch(SET_OPEN_EDIT_POST_DIALOG(e))} />
        </>
    );
}
