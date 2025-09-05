import { useState } from "react";
import { Button } from "../ui/button";
import { Tabs } from "../ui/tabs";
import NotiAll from "./noti-all";
import NotiUnread from "./noti-unread";

export default function Notification() {
    const [type, setType] = useState<"all" | "unread">("all");

    return (
        <div>
            <Tabs defaultValue="account" className="w-full gap-0">
                <div className="flex flex-col gap-5 bg-background rounded-t-xl shadow-xs border-b p-3">
                    <div className="flex items-baseline justify-between">
                        <h3 className="text-lg font-semibold leading-[1]">Notifications</h3>
                        {/* <p className="text-sm text-muted-foreground leading-[1]">Mark all as read</p> */}
                    </div>

                    <div className="flex items-center justify-start gap-1">
                        <Button onClick={() => setType("all")} variant={type === "all" ? "outline" : "ghost"} size="sm">
                            All
                        </Button>
                        <Button onClick={() => setType("unread")} variant={type === "unread" ? "outline" : "ghost"} size="sm">
                            Unread
                        </Button>
                    </div>
                </div>

                {type === "all" ? <NotiAll /> : <NotiUnread />}
            </Tabs>
        </div>
    );
}
