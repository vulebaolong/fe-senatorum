import { useAppSelector } from "@/redux/store";
import AvatartImageCustom from "../custom/avatar-custom/avatart-custom";
import Name from "../name/name";

export default function NavUserInfo() {
    const info = useAppSelector((state) => state.user.info);

    return (
        <div className="flex items-center gap-2 py-1.5 text-left text-sm">
            <AvatartImageCustom className="h-8 w-8 rounded-full" nameFallback={info?.name} nameRouterPush={info?.username} src={info?.avatar} />
            <div className="grid flex-1 text-left text-sm leading-tight">
                <Name name={info?.name || "??"} username={info?.username || "??"} />
                <span className="truncate text-xs text-muted-foreground">@{info?.username}</span>
            </div>
        </div>
    );
}
