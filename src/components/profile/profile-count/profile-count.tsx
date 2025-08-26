import { useGetCountFollow } from "@/api/tantask/follow.action";
import { TUser } from "@/types/user.type";

type TProps = {
    profile: TUser | null;
};

export default function ProfileCount({ profile }: TProps) {
    const getCountFollow = profile ? useGetCountFollow(profile?.id) : { data: null };
    // console.log({ getCountFollow: getCountFollow.data });
    return (
        <div className="flex gap-6 mt-4 text-sm">
            <div>
                <span className="font-semibold text-accent-foreground">{getCountFollow.data?.followers || 0}</span>
                <span className="text-muted-foreground ml-1">Followers</span>
            </div>
            <div>
                <span className="font-semibold text-accent-foreground">{getCountFollow.data?.following || 0}</span>
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
    );
}
