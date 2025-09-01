"use client";

import Header from "@/components/header/header";
import { AppSidebar } from "@/components/nav/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { VERSION } from "@/constant/app.constant";
import { useSocket } from "@/hooks/socket.hook";
import { useAppDispatch } from "@/redux/store";
import { SET_OPEN_VERSION_UPDATE_DIALOG } from "@/redux/slices/setting.slice";
import { TSocketRes } from "@/types/base.type";
import { useEffect } from "react";

type TProps = {
    children: React.ReactNode;
};

export default function layout({ children }: TProps) {
    const { socket } = useSocket();
    const dispatch = useAppDispatch();

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
            <Header />
            <SidebarProvider defaultOpen={false} className="pt-[var(--header-height)]">
                <AppSidebar />
                <SidebarInset>{children}</SidebarInset>
            </SidebarProvider>
        </>
    );
}
