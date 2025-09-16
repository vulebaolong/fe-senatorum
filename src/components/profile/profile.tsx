"use client";

import { ROUTER_CLIENT } from "@/constant/router.constant";
import { checkPathImage } from "@/helpers/function.helper";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/store";
import { TUser } from "@/types/user.type";
import { Pencil, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { Container } from "../container/container";
import AvatartImageCustom from "../custom/avatar-custom/avatart-custom";
import ImageCustom from "../custom/image-custom/ImageCustom";
import { HeaderPage } from "../header/header-page/header-page";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import ProfileCount from "./profile-count/profile-count";
import ProfileFollow from "./profile-follow/profile-follow";
import ProfileTabs from "./profile-tabs/profile-tabs";

type Props = {
    dataProfile: TUser;
    isFollowing: boolean;
};

export default function Profile({ dataProfile, isFollowing }: Props) {
    const bodyRef = useRef<HTMLDivElement>(null);
    const tabsAnchorRef = useRef<HTMLDivElement>(null);
    const info = useAppSelector((state) => state.user.info);
    const router = useRouter();

    return (
        <div className="h-[calc(100dvh-var(--header-height))] flex flex-col">
            {/* header */}
            <HeaderPage as="header" backTo={ROUTER_CLIENT.HOME} backLabel="Back to Home" title="Profile" />

            {/* body */}
            <div ref={bodyRef} className="flex-1 px-3 py-5 overflow-y-auto scroll-smooth">
                <Container>
                    <div className="flex flex-col gap-5">
                        {/* header */}
                        <Card className="py-0">
                            <CardContent className="p-0">
                                {/* Cover Image */}
                                <div
                                    className={cn(
                                        "aspect-[3/1]",
                                        dataProfile.banner
                                            ? ""
                                            : "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-t-lg overflow-hidden relative"
                                    )}
                                >
                                    {/* <div className="absolute inset-0 bg-black/20 rounded-t-lg"></div> */}
                                    {dataProfile.banner && <ImageCustom src={checkPathImage(dataProfile.banner) || ""} alt="Banner" />}
                                </div>

                                {/* Profile Info */}
                                <div className="px-6 pb-6">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16 relative z-10">
                                        {/* Avatar */}
                                        {dataProfile.avatar ? (
                                            <AvatartImageCustom name={dataProfile.name} src={dataProfile.avatar} />
                                        ) : (
                                            <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                                                <User className="w-16 h-16 text-slate-400" />
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-2 sm:ml-auto">
                                            <>
                                                {info?.id !== dataProfile.id && (
                                                    <ProfileFollow isFollowing={isFollowing} followingId={dataProfile.id} />
                                                )}
                                            </>

                                            {/* <Button variant="outline" size="sm">
                                            <Settings className="w-4 h-4" />
                                        </Button> */}
                                            {info?.id === dataProfile.id && (
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
                                            <h1 className="text-2xl font-bold">{dataProfile.name}</h1>
                                            {/* <Shield className="w-5 h-5 text-blue-500" /> */}
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">@{dataProfile.username}</p>
                                        <p className="text-shadow-muted mt-3 max-w-2xl">{dataProfile.bio}</p>

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
                                        <ProfileCount profile={dataProfile} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <ProfileTabs bodyRef={bodyRef} profile={dataProfile} tabsAnchorRef={tabsAnchorRef} />
                    </div>
                </Container>
            </div>
        </div>
    );
}
