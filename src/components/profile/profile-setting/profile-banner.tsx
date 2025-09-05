import { useDeleteBanner, useDeleteBannerDraft, useUploadBanner, useUploadBannerDraft } from "@/api/tantask/user.tanstack";
import ImageCustom from "@/components/custom/image-custom/ImageCustom";
import ImageUpload from "@/components/image-upload/image-upload";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY } from "@/constant/app.constant";
import { checkPathImage } from "@/helpers/function.helper";
import { useAppSelector } from "@/redux/store";
import { Bandage, Loader2Icon, Save, Trash } from "lucide-react";
import React from "react";

export default function ProfileBanner() {
    const info = useAppSelector((state) => state.user.info);

    const uploadBannerDraft = useUploadBannerDraft();
    const deleteBannerDraft = useDeleteBannerDraft();
    const deleteBanner = useDeleteBanner();
    const uploadBanner = useUploadBanner();

    const onUpload = async (file: File) => {
        const fd = new FormData();
        fd.append("bannerDraft", file);
        // mutation phải trả về publicId (string)
        return await uploadBannerDraft.mutateAsync(fd);
    };

    const onDeleteClick = (e: React.MouseEvent) => {
        deleteBanner.mutate();
    };

    const onClickSave = () => {
        uploadBanner.mutate();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bandage className="w-5 h-5 text-pink-500" />
                    Profile Banner
                </CardTitle>
                <CardDescription>Upload your profile banner and cover photo</CardDescription>
                <div className="grid gap-10 mt-10">
                    <div className="flex items-center gap-5">
                        <Avatar className="h-40 w-64 rounded-xl overflow-hidden relative group">
                            <ImageCustom className="object-cover" src={checkPathImage(info?.banner) || ""} alt={`banner`} />
                            {info?.banner && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button type="button" variant="outline" onClick={onDeleteClick} size="icon" className="size-8">
                                        <Trash />
                                    </Button>
                                </div>
                            )}
                        </Avatar>
                        <ImageUpload
                            value={!info?.bannerDraft ? "" : `${NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY}/${info?.bannerDraft}`} // publicId hiện tại
                            onSuccessToServer={(id) => {
                                console.log({ onChange: id });
                            }}
                            onUploadToServer={onUpload} // gọi tanstack bên ngoài
                            isUploading={uploadBannerDraft.isPending || deleteBannerDraft.isPending}
                            onUploadError={(e) => {
                                console.error(e);
                            }}
                            onDelete={async () => {
                                if (info?.bannerDraft) {
                                    deleteBannerDraft.mutate();
                                }
                            }}
                            // tuỳ chọn giao diện
                            className="h-40 w-64"
                            variant="square"
                        />
                    </div>

                    <Button
                        disabled={!!!info?.bannerDraft || uploadBanner.isPending}
                        type="button"
                        onClick={onClickSave}
                        variant="outline"
                        size={"sm"}
                        className="w-[80px]"
                    >
                        {uploadBanner.isPending ? <Loader2Icon className="animate-spin" /> : <Save />}
                        Save
                    </Button>
                </div>
            </CardHeader>
        </Card>
    );
}
