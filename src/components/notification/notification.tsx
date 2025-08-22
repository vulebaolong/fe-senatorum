import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export default function Notification() {
    return (
        <div>
            <Tabs defaultValue="account" className="w-full ">
                <div className="bg-background rounded-t-md shadow-xs border-b p-3">
                    <div className="flex items-baseline justify-between">
                        <h3 className="text-lg font-semibold leading-[1]">Notifications</h3>
                        <p className="text-sm text-muted-foreground leading-[1]">Mark all as read</p>
                    </div>

                    <TabsList className="bg-transparent mt-3 p-0">
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="password">Password</TabsTrigger>
                    </TabsList>
                </div>
                <div className="h-[200px] overflow-y-auto">
                    <TabsContent value="account">
                        {[0, 1, 2, 3, 4, 5].map((item) => (
                            <div key={item} className="p-3 flex gap-3">
                                <Avatar className="h-10 w-10 rounded-full">
                                    <AvatarImage src={""} alt={"avatar"} />
                                    <AvatarFallback className="rounded-lg">{"vulebaolong".slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate text-md font-bold">New like on your post</span>
                                    <span className="truncate text-sm font-medium">Sara Parker liked your post</span>
                                    <span className="truncate text-xs text-muted-foreground">2 days ago</span>
                                </div>
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                            </div>
                        ))}
                    </TabsContent>
                    <TabsContent value="password">Change your password here.</TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
