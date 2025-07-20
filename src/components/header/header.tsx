import { BellRing } from "lucide-react";
import ButtonIcon from "../custom/button-custom/button-icon";
import { Logo } from "../logo/Logo";
import Marquee from "./marquee";
import Search from "./search";

export default function Header() {
    return (
        <header className="fixed w-full h-[var(--header-height)] flex items-center justify-between flex-col">
            <Marquee />
            <div className="px-10 pl-[12px] w-full h-[40px] rounded-xl flex items-center justify-between">
                <Logo className="h-full" />

                <Search />

                <ButtonIcon variant="secondary" size="icon" className="size-8 relative">
                    <BellRing className="size-5" />
                    <div className="flex items-center justify-center text-[10px] absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 text-white w-4 h-4 bg-red-500 rounded-sm">
                        5
                    </div>
                </ButtonIcon>
            </div>
        </header>
    );
}
