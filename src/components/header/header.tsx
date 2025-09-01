import { Logo } from "../logo/Logo";
import HeaderBellring from "./header-bellring";
import Search from "./search";

export default function Header() {
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
                    <div className="flex-shrink-0">
                        <HeaderBellring />
                    </div>
                </div>
            </header>
        </div>
    );
}
