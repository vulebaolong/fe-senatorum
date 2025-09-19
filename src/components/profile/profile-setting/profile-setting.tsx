"use client";

import { useGetInfoQuery } from "@/api/tantask/auth.tanstack";
import { Container } from "@/components/container/container";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAppSelector } from "@/redux/store";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import ProfileAvatar from "./profile-avatar";
import ProfileBanner from "./profile-banner";
import ProfileBasic from "./profile-basic";

export default function ProfileSetting() {
    useGetInfoQuery();

    const info = useAppSelector((state) => state.user.info);
    const router = useRouter();

    return (
        <div className="h-[calc(100dvh-var(--header-height))] flex flex-col">
            {/* header */}
            <div className="relative bg-background flex items-center justify-between w-full px-3 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        onClick={() => {
                            if (info) router.push(`/${info.username}`);
                        }}
                        variant="link"
                        size={"sm"}
                        className="text-muted-foreground"
                    >
                        <ArrowLeft />
                        Back to Profile
                    </Button>
                    <Separator orientation="vertical" className="!h-[20px]" />
                    <p className="text-lg font-semibold">Edit Profile</p>
                </div>
            </div>

            {/* body */}
            <div className="flex-1 p-5 overflow-y-auto">
                <Container>
                    <div className="flex flex-col gap-10">
                        {/*  Profile Banner */}
                        <ProfileBanner />

                        {/*  Profile Images */}
                        <ProfileAvatar />

                        {/* Basic Information */}
                        <ProfileBasic />
                    </div>
                </Container>
            </div>
        </div>
    );
}
