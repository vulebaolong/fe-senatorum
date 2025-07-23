"use client";

import Header from "@/components/header/header";
import { AppSidebar } from "@/components/nav/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

type TProps = {
    children: React.ReactNode;
};

export default function layout({ children }: TProps) {
    return (
        <>
            <Header />
            <SidebarProvider defaultOpen={false} className="pt-[var(--header-height)]">
                <AppSidebar />
                <SidebarInset>
                    <main>{children}</main>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}
