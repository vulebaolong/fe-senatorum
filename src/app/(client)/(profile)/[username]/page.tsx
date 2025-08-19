import { getProfileByUsername } from "@/api/actions/auth.action";
import Profile from "@/components/profile/profile";

type TProps = {
    params: Promise<{ username: string }>;
};

export default async function Page({ params }: TProps) {
    const { username } = await params;
    console.log({ username });
    const dataProfile = await getProfileByUsername(username);

    return <Profile dataProfile={dataProfile} />;
}
