import { Logo } from "../logo/Logo";
import HeaderBellring from "./header-bellring";
import Search from "./search";

export default function Header() {
    return (
        <div>
            <header className=" fixed w-full h-[var(--header-height)] flex items-center justify-between flex-col bg-sidebar border-sidebar-border border shadow-sm">
                {/* <Marquee /> */}
                <div className="px-[15px] py-2 w-full h-[50px] rounded-xl flex items-center justify-between">
                    <Logo />
                    <Search />
                    <HeaderBellring />
                </div>
            </header>
        </div>
    );
}
