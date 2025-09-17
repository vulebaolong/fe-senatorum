import { getProfileByUsername } from "@/api/actions/auth.action";
import { getIsFollowingAction } from "@/api/actions/follow.action";
import Profile from "@/components/profile/profile";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleX } from "lucide-react";

type TProps = {
    params: Promise<{ username: string }>;
};

export default async function Page({ params }: TProps) {
    const { username } = await params;
    const dataProfile = await getProfileByUsername(username);
    let isFollowing: boolean | undefined = undefined;
    if (dataProfile.data?.id) {
        const { data } = await getIsFollowingAction(dataProfile.data?.id);
        isFollowing = data?.following;
    }

    return (
        <>
            {dataProfile.data && isFollowing !== undefined ? (
                <Profile dataProfile={dataProfile.data} isFollowing={isFollowing} />
            ) : (
                <Alert variant="default">
                    <CircleX color="red" />
                    <AlertTitle>No Profile</AlertTitle>
                    <AlertDescription>No Profile</AlertDescription>
                </Alert>
            )}
        </>
    );
}
