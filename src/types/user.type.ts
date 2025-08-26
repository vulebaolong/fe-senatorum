import { TBaseTimestamps } from "./base.type";
import { TFollow } from "./follow.type";
import { TRole } from "./role.type";

export type TUser = {
   id: string;
   email: string;
   name: string;
   username: string;
   avatar?: string;
   roleId: string;
   Roles: TRole;
   isTotp: boolean;
   Follows_Follows_followingIdToUsers: TFollow[] | [];
} & TBaseTimestamps;

export type TUploadAvatarLocalRes = {
   folder: string;
   filename: string;
   imgUrl: string;
};

export type TEditProfileReq = {
   id: string;
   name: string;
};