import { useDeleteImagePostByPublicId, useGetDraftPost, usePublishPost, useUploadImagePost, useUpsertPostDarft } from "@/api/tantask/post.tanstack";
import { SET_ARTICLE_NEW, SET_OFFSET_NEW } from "@/redux/slices/article.slice";
import { SET_OPEN_CREATE_POST_DIALOG } from "@/redux/slices/setting.slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useDebouncedCallback } from "@mantine/hooks";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ImagesUpload from "../images-upload/images-upload";
import NavUserInfo from "../nav/nav-user-info";
import { Textarea } from "../textarea/textarea";
import { Button } from "../ui/button";
import { ButtonLoading } from "../ui/button-loading";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { resError } from "@/helpers/function.helper";
import { toast } from "sonner";

type TProps = {
    type: "create" | "edit";
};

export default function CreatePost({ type }: TProps) {
    const openCreatePostDialog = useAppSelector((state) => state.setting.openCreatePostDialog);
    const dispatch = useAppDispatch();
    const [value, setValue] = useState("");
    const firstRunRef = useRef(true);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [loadingUpsertPostDraft, setLoadingUpsertPostDraft] = useState(false);
    const router = useRouter();

    const getDraftPost = useGetDraftPost();
    const upsertPostDarft = useUpsertPostDarft();
    const uploadImagePost = useUploadImagePost();
    const deleteImagePostByPublicId = useDeleteImagePostByPublicId();
    const publishPost = usePublishPost();

    useEffect(() => {
        if (getDraftPost.data) {
            setValue(getDraftPost.data.content);
        }
    }, [getDraftPost.data]);

    const handleUpsert = useDebouncedCallback(
        async (query: any) => {
            if (firstRunRef.current) return (firstRunRef.current = false);

            switch (type) {
                case "create":
                    console.log({ Debounce: query });
                    upsertPostDarft.mutate(
                        {
                            content: query,
                        },
                        {
                            onSuccess: () => {
                                setLoadingUpsertPostDraft(false);
                            },
                        }
                    );
                    break;

                case "edit":
                    if (!value.trim()) return;

                    // upsertArticleEdit.mutate({
                    //     id: article.id,
                    //     title: query.title,
                    //     content: query.content,
                    //     thumbnail: query.thumbnail,
                    //     typeId: query.typeId || undefined,
                    //     categoryIds: query.categoryIds,
                    // });
                    break;

                default:
                    break;
            }
        },
        {
            delay: 1000,
            leading: false,
            flushOnUnmount: true,
        }
    );
    useEffect(() => {
        handleUpsert(value);
    }, [value]);

    const handleCreatePost = () => {
        publishPost.mutate(undefined, {
            onSuccess: (newArticle) => {
                setValue("");
                setImageUrls([]);
                dispatch(SET_OPEN_CREATE_POST_DIALOG(false));
                dispatch(SET_ARTICLE_NEW(newArticle));
                dispatch(SET_OFFSET_NEW());
            },
            onError: (error) => {
                toast.error(resError(error, `Publish Post failed`));
            }
        });
    };

    async function uploadOne(file: File): Promise<string> {
        // TODO: gọi API của bạn, trả về publicId/URL
        const formData = new FormData();
        formData.append("imagePost", file);
        console.log({ formData });

        const publicId = await uploadImagePost.mutateAsync(formData);

        // await wait(10000);

        return publicId;
    }

    function handleDeleteImagePostByPublicId(publicId: string) {
        deleteImagePostByPublicId.mutate(publicId);
    }

    return (
        <Dialog
            open={openCreatePostDialog}
            onOpenChange={(e) => {
                dispatch(SET_OPEN_CREATE_POST_DIALOG(e));
            }}
        >
            <DialogContent showCloseButton={false}>
                {/* header */}
                <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle>Create Quick Post</DialogTitle>

                    <div className="flex items-center gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary" size="icon" className="size-6">
                                <X />
                            </Button>
                        </DialogClose>
                    </div>
                </DialogHeader>

                <Separator />

                {/* body */}
                <div className="overflow-y-auto max-h-[calc(100dvh-300px)]">
                    <NavUserInfo />
                    <div className="">
                        <Textarea
                            // id={inputId}
                            // ref={textareaRef}
                            noStyle
                            className="flex-1 h-full resize-none" // thay cho sx={{ flex: 1 }}
                            placeholder="What's on your mind?"
                            minRows={5}
                            maxRows={5}
                            value={value || ""}
                            onChange={(e) => {
                                setValue(e.target.value.normalize("NFC"));
                                setLoadingUpsertPostDraft(true);
                            }}
                            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                                // Enter để gửi, Shift+Enter để xuống dòng
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleCreatePost();
                                }
                            }}
                        />
                        <ImagesUpload
                            onUploadToServer={uploadOne}
                            initialServerUrls={getDraftPost.data?.imageUrls}
                            onChange={setImageUrls}
                            onDelete={handleDeleteImagePostByPublicId}
                            disabled={publishPost.isPending || uploadImagePost.isPending}
                            maxCount={10}
                            title="Upload photos"
                            description="You can upload up to 10 images"
                        />
                    </div>
                </div>

                <Separator />

                {/* footer */}
                <DialogFooter className="fle">
                    <ButtonLoading
                        onClick={handleCreatePost}
                        loading={publishPost.isPending}
                        disabled={
                            publishPost.isPending ||
                            uploadImagePost.isPending ||
                            deleteImagePostByPublicId.isPending ||
                            loadingUpsertPostDraft
                        }
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-2 text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Post
                    </ButtonLoading>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
