import { useDeleteAvatar, useDeleteAvatarDraft, useUploadAvatar, useUploadAvatarDraft } from "@/api/tantask/user.tanstack";
import ImageUpload from "@/components/image-upload/image-upload";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY } from "@/constant/app.constant";
import { checkPathImage } from "@/helpers/function.helper";
import { useAppSelector } from "@/redux/store";
import { Camera, Loader2Icon, Save, Trash } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function ProfileAvatar() {
    const info = useAppSelector((state) => state.user.info);

    const uploadAvatarDraft = useUploadAvatarDraft();
    const deleteAvatarDraft = useDeleteAvatarDraft();
    const deleteAvatar = useDeleteAvatar();
    const uploadAvatar = useUploadAvatar();

    const onUpload = async (file: File) => {
        const fd = new FormData();
        fd.append("avatarDraft", file);
        // mutation phải trả về publicId (string)
        return await uploadAvatarDraft.mutateAsync(fd);
    };

    const onDeleteClick = (e: React.MouseEvent) => {
        deleteAvatar.mutate();
    };

    const onClickSave = () => {
        uploadAvatar.mutate();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-green-500" />
                    Profile Images
                </CardTitle>
                <CardDescription>Upload your profile picture and cover photo</CardDescription>
                <div className="grid gap-10 mt-10">
                    <div className="flex items-center gap-5">
                        <Avatar className="size-32 rounded-full relative group">
                            <AvatarImage className="object-cover" src={checkPathImage(info?.avatar) || undefined} alt={info?.name} />
                            <AvatarFallback className="rounded-lg">{info?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                            {info?.avatar && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button type="button" variant="outline" onClick={onDeleteClick} size="icon" className="size-8">
                                        <Trash />
                                    </Button>
                                </div>
                            )}
                        </Avatar>
                        <ImageUpload
                            value={!info?.avatarDraft ? "" : `${NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY}/${info.avatarDraft}`} // publicId hiện tại
                            onSuccessToServer={(id) => {
                                console.log({ onChange: id });
                            }}
                            onUploadToServer={onUpload} // gọi tanstack bên ngoài
                            isUploading={uploadAvatarDraft.isPending || deleteAvatarDraft.isPending}
                            onUploadError={(err) => toast.error((err as Error).message)}
                            onDelete={async () => {
                                if (info?.avatarDraft) {
                                    deleteAvatarDraft.mutate();
                                }
                            }}
                            // tuỳ chọn giao diện
                            className="size-32"
                            variant="round"
                        />
                    </div>

                    <Button
                        disabled={!!!info?.avatarDraft || uploadAvatar.isPending}
                        type="button"
                        onClick={onClickSave}
                        variant="outline"
                        size={"sm"}
                        className="w-[80px]"
                    >
                        {uploadAvatar.isPending ? <Loader2Icon className="animate-spin" /> : <Save />}
                        Save
                    </Button>
                </div>
            </CardHeader>
        </Card>
    );
}
