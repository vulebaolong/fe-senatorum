import { TBaseTimestamps } from "./base.type";
import { TRole } from "./role.type";

export type TUser = {
   id: string;
   email: string;
   name: string;
   username: string;
   avatar?: string;
   googleId?: string;
   roleId: string;
   Roles: TRole;
   isTotp: boolean;
} & TBaseTimestamps;

export type TProfile = {
   id: TUser["id"];
   email: TUser["email"];
   name: TUser["name"];
   username: TUser["username"];
   avatar?: TUser["avatar"];
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