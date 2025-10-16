import { useState } from "react";
import { Button } from "../ui/button";
import { Tabs } from "../ui/tabs";
import NotificationFeed from "./notification-feed";

export default function Notification() {
    const [type, setType] = useState<"all" | "unread">("all");

    return (
        <div>
            <Tabs defaultValue="account" className="w-full gap-0">
                <div className="flex flex-col gap-5 bg-background rounded-t-xl shadow-xs border-b p-3">
                    <div className="flex items-baseline justify-between">
                        <h3 className="text-lg font-semibold leading-[1]">Notifications</h3>
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

                {/* key=type để state trong feed reset đúng, cache query vẫn tách nhờ filters */}
                <NotificationFeed key={type} mode={type} />
            </Tabs>
        </div>
    );
}
