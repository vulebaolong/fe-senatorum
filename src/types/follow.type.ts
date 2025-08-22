import { TBaseTimestamps } from "./base.type";

export type TFollowReq = {
    followingId: string;
};

export type TFollow = {
    id: string;
    followerId: string;
    followingId: string;
    isMuted: boolean;
    notes: string | null;
} & TBaseTimestamps;

export type TFollowCountRes = {
    followers: number;
    following: number;
};
