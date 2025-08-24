import { BellRing } from "lucide-react";
import ButtonIcon from "../custom/button-custom/button-icon";
import { Logo } from "../logo/Logo";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Search from "./search";
import Notification from "../notification/notification";

export default function Header() {
    return (
        <div>
            <header className=" fixed w-full h-[var(--header-height)] flex items-center justify-between flex-col bg-sidebar border-sidebar-border border shadow-sm">
                {/* <Marquee /> */}
                <div className="px-[15px] py-2 w-full h-[50px] rounded-xl flex items-center justify-between">
                    <Logo />
                    <Search />

                    <div className=""></div>

                    <Popover>
                        <PopoverTrigger asChild>
                            <ButtonIcon variant="secondary" size="icon" className="size-8 relative mr-2">
                                <BellRing className="size-5" />
                                <div className="flex items-center justify-center text-[10px] absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 text-white w-4 h-4 bg-red-500 rounded-sm">
                                    5
                                </div>
                            </ButtonIcon>
                        </PopoverTrigger>
                        <PopoverContent className="w-90 p-0" align="end" sideOffset={5}>
                            <Notification />
                        </PopoverContent>
                    </Popover>
                </div>
            </header>
        </div>
    );
}
