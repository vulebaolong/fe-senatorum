"use client";

import { ROUTER_CLIENT } from "@/constant/router.constant";
import { useAppSelector } from "@/redux/store";
import { TResAction } from "@/types/app.type";
import { TUser } from "@/types/user.type";
import { Pencil, Shield, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import AvatartImageCustom from "../custom/avatar-custom/avatart-custom";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import ProfileCount from "./profile-count/profile-count";
import ProfileFollow from "./profile-follow/profile-follow";
import ProfileTabs from "./profile-tabs/profile-tabs";
import ImageCustom from "../custom/image-custom/ImageCustom";
import { NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY } from "@/constant/app.constant";
import { cn } from "@/lib/utils";

type Props = {
    dataProfile: TResAction<TUser | null>;
};

export default function Profile({ dataProfile }: Props) {
    const bodyRef = useRef<HTMLDivElement>(null); // khung scroll
    const tabsAnchorRef = useRef<HTMLDivElement>(null); // neo ở chỗ TabsList
    const info = useAppSelector((state) => state.user.info);
    const router = useRouter();

    return (
        <div className="h-[calc(100vh-var(--header-height))] flex flex-col">
            {/* header */}
            <div className="relative bg-background  w-full p-3 shadow-sm">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold">Profile</p>

                        {/* <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                                <Share /> Share
                            </Button>
                            <Button variant="outline" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </div> */}
                    </div>
                </div>
            </div>

            {/* body */}
            <div ref={bodyRef} className="flex-1 px-3 py-5 overflow-y-auto scroll-smooth">
                <div className="max-w-6xl mx-auto px-6 flex flex-col gap-5">
                    {/* Profile Header */}
                    <Card className="py-0">
                        <CardContent className="p-0">
                            {/* Cover Image */}
                            <div
                                className={cn(
                                    "aspect-[3/1]",
                                    dataProfile?.data?.banner
                                        ? ""
                                        : "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-t-lg overflow-hidden relative"
                                )}
                            >
                                {/* <div className="absolute inset-0 bg-black/20 rounded-t-lg"></div> */}
                                {dataProfile?.data?.banner && (
                                    <ImageCustom src={`${NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY}/${dataProfile.data.banner}`} alt="Banner" />
                                )}
                            </div>

                            {/* Profile Info */}
                            <div className="px-6 pb-6">
                                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16 relative z-10">
                                    {/* Avatar */}
                                    {dataProfile.data?.avatar ? (
                                        <AvatartImageCustom name={dataProfile.data?.name} src={dataProfile.data?.avatar} />
                                    ) : (
                                        <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                                            <User className="w-16 h-16 text-slate-400" />
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2 sm:ml-auto">
                                        <ProfileFollow user={dataProfile.data} />

                                        {/* <Button variant="outline" size="sm">
                                            <Settings className="w-4 h-4" />
                                        </Button> */}
                                        {info?.id === dataProfile.data?.id && (
                                            <Button
                                                onClick={() => {
                                                    router.push(ROUTER_CLIENT.SETTING_PROFILE);
                                                }}
                                                variant="outline"
                                                className="size-8"
                                            >
                                                <Pencil />
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* User Details */}
                                <div className="mt-4">
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-2xl font-bold">{dataProfile.data?.name}</h1>
                                        {/* <Shield className="w-5 h-5 text-blue-500" /> */}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">@{dataProfile.data?.username}</p>
                                    <p className="text-shadow-muted mt-3 max-w-2xl">{dataProfile.data?.bio}</p>

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

                                    {/* Count */}
                                    <ProfileCount profile={dataProfile.data} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <ProfileTabs bodyRef={bodyRef} profile={dataProfile.data} tabsAnchorRef={tabsAnchorRef} />
                </div>
            </div>
        </div>
    );
}
