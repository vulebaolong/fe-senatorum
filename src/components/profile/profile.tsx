"use client";

import { MoreHorizontal, Settings, Share, Shield, User, UserPlus } from "lucide-react";
import Articlelist from "../article/article-list/article-list";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { TResAction } from "@/types/app.type";
import { TProfile } from "@/types/user.type";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useCallback, useRef } from "react";

type Props = {
    dataProfile: TResAction<TProfile | null>;
};

export default function Profile({ dataProfile }: Props) {
    const bodyRef = useRef<HTMLDivElement>(null); // khung scroll
    const tabsAnchorRef = useRef<HTMLDivElement>(null); // neo ở chỗ TabsList

    const scrollTabsIntoView = useCallback(() => {
        const scroller = bodyRef.current;
        const anchor = tabsAnchorRef.current;
        if (!scroller || !anchor) return;

        // khoảng cách từ anchor tới mép trên của khung scroll
        const scrollerRect = scroller.getBoundingClientRect();
        const anchorRect = anchor.getBoundingClientRect();
        const delta = anchorRect.top - scrollerRect.top;

        // trừ 1 khoảng đệm nhỏ nếu muốn sát hơn
        const GAP = 8; // px
        scroller.scrollTo({ top: scroller.scrollTop + delta - GAP, behavior: "smooth" });
    }, []);

    return (
        <div className="h-[calc(100vh-var(--header-height))] flex flex-col">
            {/* header */}
            <div className="relative bg-background  w-full p-3 shadow-sm">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold">Profile</p>

                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                                <Share /> Share
                            </Button>
                            <Button variant="outline" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* body */}
            <div ref={bodyRef} className="flex-1 px-3 py-5 overflow-y-auto ">
                <div className="max-w-6xl mx-auto px-6 flex flex-col gap-5">
                    {/* Profile Header */}
                    <Card className="py-0">
                        <CardContent className="p-0">
                            {/* Cover Image */}
                            <div className="h-48 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-t-lg relative">
                                <div className="absolute inset-0 bg-black/20 rounded-t-lg"></div>
                            </div>

                            {/* Profile Info */}
                            <div className="px-6 pb-6">
                                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16 relative z-10">
                                    {/* Avatar */}
                                    {dataProfile.data?.avatar ? (
                                        <Avatar className="w-32 h-32 rounded-full">
                                            <AvatarImage src={dataProfile.data?.avatar} alt={dataProfile.data?.name} />
                                            <AvatarFallback className="rounded-lg">{dataProfile.data?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                    ) : (
                                        <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                                            <User className="w-16 h-16 text-slate-400" />
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2 sm:ml-auto">
                                        <Button className="gap-2">
                                            <UserPlus className="w-4 h-4" />
                                            Following
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <Settings className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* User Details */}
                                <div className="mt-4">
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-2xl font-bold">{dataProfile.data?.name}</h1>
                                        <Shield className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <p className="text-muted-foreground mt-1">@{dataProfile.data?.username}</p>
                                    <p className="text-shadow-muted mt-3 max-w-2xl">
                                        Full-stack developer passionate about creating amazing user experiences. Building the future one line of code
                                        at a time.
                                    </p>

                                    {/* Meta Info */}
                                    {/* <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-600">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {userData.location}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Globe className="w-4 h-4" />
                                            <a href="#" className="text-blue-600 hover:underline">
                                                {userData.website}
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            Joined {userData.joinedDate}
                                        </div>
                                    </div> */}

                                    {/* Stats */}
                                    <div className="flex gap-6 mt-4">
                                        <div>
                                            <span className="font-semibold text-accent-foreground">123123</span>
                                            <span className="text-muted-foreground ml-1">Followers</span>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-accent-foreground">123123</span>
                                            <span className="text-muted-foreground ml-1">Following</span>
                                        </div>
                                        {/* <div>
                                            <span className="font-semibold text-slate-900">{userData.stats.chapters}</span>
                                            <span className="text-slate-600 ml-1">Chapters</span>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-slate-900">{userData.stats.houses}</span>
                                            <span className="text-slate-600 ml-1">Houses</span>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Tabs defaultValue="my-article" onValueChange={() => scrollTabsIntoView()}>
                        <div ref={tabsAnchorRef} className="scroll-mt-2">
                            <TabsList>
                                <TabsTrigger value="my-article">My Article</TabsTrigger>
                                <TabsTrigger value="upvoted">Upvoted</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="my-article">
                            <Card className="p-0">
                                <Articlelist type="my" />
                            </Card>
                        </TabsContent>

                        <TabsContent value="upvoted">
                            <Card className="p-0">
                                <Articlelist type="upvoted" />
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
