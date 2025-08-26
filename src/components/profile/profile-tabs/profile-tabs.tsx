"use client";

import { RefObject, useCallback } from "react";
import Articlelist from "@/components/article/article-list/article-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useAppSelector } from "@/redux/hooks";
import { useHashScrollWithin } from "@/hooks/use-hash-scroll-within";
import { useRouter } from "next/navigation";
import { TUser } from "@/types/user.type";

type TProps = {
    profile: TUser | null;
    bodyRef: RefObject<HTMLDivElement | null>;
    tabsAnchorRef: RefObject<HTMLDivElement | null>;
};

export default function ProfileTabs({ profile, bodyRef, tabsAnchorRef }: TProps) {
    const info = useAppSelector((state) => state.user.info);
    const router = useRouter();

    const { scrollToHash } = useHashScrollWithin(bodyRef);

    return (
        <Tabs
            defaultValue="my-article"
            onValueChange={(val) => {
                // cập nhật hash để nơi khác có thể router.push('#...') và vẫn hoạt động
                router.push(`#${val}`, { scroll: false }); // không cuộn window
                // nếu hash không đổi (click lại cùng tab), hashchange sẽ không bắn → ta chủ động cuộn
                scrollToHash(`#${val}`);
            }}
        >
            <div ref={tabsAnchorRef} className="scroll-mt-2">
                <TabsList>
                    <TabsTrigger value="my-article" id="my-article">
                        {info?.id === profile?.id ? "My articles" : "Articles"}
                    </TabsTrigger>
                    {info?.id === profile?.id && (
                        <TabsTrigger value="upvoted" id="upvoted">
                            Upvoted
                        </TabsTrigger>
                    )}
                    {info?.id === profile?.id && (
                        <TabsTrigger value="bookmarked" id="bookmarked">
                            Bookmarked
                        </TabsTrigger>
                    )}
                </TabsList>
            </div>

            <TabsContent value="my-article">
                <Card className="p-0">
                    <Articlelist type="all" filters={{ userId: profile?.id }} />
                </Card>
            </TabsContent>

            <TabsContent value="upvoted">
                <Card className="p-0">
                    <Articlelist type="upvoted" filters={{ userId: profile?.id }} />
                </Card>
            </TabsContent>

            <TabsContent value="bookmarked">
                <Card className="p-0">
                    <Articlelist type="bookmarked" filters={{ userId: profile?.id }} />
                </Card>
            </TabsContent>
        </Tabs>
    );
}
