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
            <SidebarProvider className="pt-[var(--header-height)]">
            {/* <SidebarProvider> */}
                <AppSidebar />
                <SidebarInset>
                    <main>{children}</main>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}
