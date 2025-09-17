import { ROUTER_CLIENT } from "@/constant/router.constant";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/store";
import { LogIn, SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";
import { Logo } from "../../logo/Logo";
import { Button } from "../../ui/button";
import HeaderBellring from "./header-bellring";
import Search from "./search";

export default function Header() {
    const info = useAppSelector((state) => state.user.info);
    const router = useRouter();

    return (
        <div>
            <header className="fixed w-full h-[var(--header-height)] flex items-center justify-between bg-sidebar border-sidebar-border border shadow-sm z-50">
                <div className="px-3 sm:px-4 md:px-6 lg:px-[15px] py-2 w-full h-[50px] flex items-center justify-between gap-2 sm:gap-4">
                    {/* Logo - always visible, responsive sizing */}
                    <div className="flex-shrink-0">
                        <Logo />
                    </div>

                    {/* Search - responsive behavior */}
                    <div className="flex-1 max-w-md mx-2 sm:mx-4 md:mx-6 lg:mx-8">
                        <Search />
                    </div>

                    {/* Bell/Notifications - always visible */}
                    {info ? (
                        <div className="flex items-center gap-2">
                            <Button
                                className={cn("!text-xs", "h-8 w-8", "sm:h-6 sm:w-28")}
                                onClick={() => {
                                    if (info?.name) {
                                        router.push(ROUTER_CLIENT.ARTICLE_CREATE);
                                    } else {
                                        console.log("info?.name is null");
                                    }
                                }}
                            >
                                <SquarePen /> <span className={cn("hidden sm:inline")}>Start Writing</span>
                            </Button>
                            <div className="flex-shrink-0">
                                <HeaderBellring />
                            </div>
                        </div>
                    ) : (
                        <Button
                            className={cn("!text-xs", "h-8 w-8", "sm:h-6 sm:w-20")}
                            onClick={() => {
                                router.push(ROUTER_CLIENT.LOGIN);
                            }}
                        >
                            <LogIn /> <span className={cn("hidden sm:inline font-bold")}>Login</span>
                        </Button>
                    )}
                </div>
            </header>
        </div>
    );
}
