import {
    useDeleteImagePostByPublicId,
    useGetDraftPost,
    useGetOnePost,
    usePostEdit,
    usePublishPost,
    useUploadImagePost,
    useUpsertPostDarft,
} from "@/api/tantask/post.tanstack";
import { resError } from "@/helpers/function.helper";
import { SET_ARTICLE_NEW } from "@/redux/slices/article.slice";
import { SET_OPEN_CREATE_POST_DIALOG, SET_OPEN_EDIT_POST_DIALOG } from "@/redux/slices/setting.slice";
import { useAppDispatch } from "@/redux/store";
import { useDebouncedCallback } from "@mantine/hooks";
import { X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { generateStableId } from "../images-upload/images-upload";
import ImagesUploadGrid from "../images-upload/images-upload-grid";
import NavUserInfo from "../nav/nav-user-info";
import { Textarea } from "../textarea/textarea";
import { Button } from "../ui/button";
import { ButtonLoading } from "../ui/button-loading";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { useArticleEdit } from "@/api/tantask/article.tanstack";

type TProps = {
    type: "create" | "edit";
    open?: boolean;
    openOnchange: (open: boolean) => void;
};

export default function PostCreate({ type, open, openOnchange }: TProps) {
    const dispatch = useAppDispatch();
    const [value, setValue] = useState("");
    const firstRunRef = useRef(true);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [loadingUpsertPostDraft, setLoadingUpsertPostDraft] = useState(false);
    const [imageFiles, setImageFiles] = useState<File[]>([]);

    const getArticleHook = useMemo(() => {
        if (type === "create") return useGetDraftPost;
        return useGetOnePost;
    }, [type]);

    const getDraftPost = getArticleHook();
    const upsertPostDarft = useUpsertPostDarft();
    const uploadImagePost = useUploadImagePost();
    const deleteImagePostByPublicId = useDeleteImagePostByPublicId();
    const publishPost = usePublishPost();
    const postEdit = usePostEdit();

    useEffect(() => {
        console.log(getDraftPost.data);
        if (getDraftPost.data) {
            console.log({ getDraftPost: getDraftPost.data });
            setValue(getDraftPost.data.content);
            setImageUrls(getDraftPost.data.imageUrls);
        }
    }, [getDraftPost.data]);

    const handleUpsert = useDebouncedCallback(
        async (query: any) => {
            if (firstRunRef.current) return (firstRunRef.current = false);
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
        },
        {
            delay: 1000,
            leading: false,
            flushOnUnmount: true,
        }
    );
    useEffect(() => {
        if (type === "create") {
            setLoadingUpsertPostDraft(true);
            handleUpsert(value);
        }
    }, [value]);

    const handleCreatePost = () => {
        console.log("Create");
        publishPost.mutate(undefined, {
            onSuccess: (newArticle) => {
                setValue("");
                setImageUrls([]);
                dispatch(SET_OPEN_CREATE_POST_DIALOG(false));
                dispatch(SET_ARTICLE_NEW(newArticle));
            },
            onError: (error) => {
                toast.error(resError(error, `Publish Post failed`));
            },
        });
    };

    const handleUpdatePost = () => {
        if (!getDraftPost.data) return;
        // console.log({ imageFiles, value });

        const formData = new FormData();
        formData.append("content", value);
        imageFiles.forEach((file) => formData.append("imagePost", file));

        // console.log(`content`, formData.getAll(`content`));
        // console.log(`imagePost`, formData.getAll(`imagePost`));

        // console.log(getDraftPost.data.id);

        postEdit.mutate({ id: getDraftPost.data.id, formData: formData });
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
        <Dialog open={open} onOpenChange={openOnchange}>
            <DialogContent showCloseButton={false}>
                {/* header */}
                <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle>{type === "create" ? "New" : "Edit"} Quick Post</DialogTitle>

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
                            noStyle
                            className="flex-1 h-full resize-none"
                            placeholder="What's on your mind?"
                            minRows={5}
                            maxRows={5}
                            value={value || ""}
                            onChange={(e) => {
                                setValue(e.target.value.normalize("NFC"));
                            }}
                            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                                // Enter để gửi, Shift+Enter để xuống dòng
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    if (type === "create") handleCreatePost();
                                    if (type === "edit") handleUpdatePost();
                                }
                            }}
                        />

                        {getDraftPost.data && (
                            <ImagesUploadGrid
                                onUploadToServer={type === "create" ? uploadOne : undefined}
                                onUploadToLocal={
                                    type === "edit"
                                        ? (files) => {
                                              setImageFiles((prev) => [...prev, ...files]);
                                          }
                                        : undefined
                                }
                                initialServerUrls={(() => {
                                    const listImage = getDraftPost.data?.imageUrls.map((url) => {
                                        return {
                                            id: generateStableId(),
                                            localBlobUrl: null,
                                            serverUrl: url,
                                            uploading: false,
                                        };
                                    });
                                    return listImage || [];
                                })()}
                                onChange={setImageUrls}
                                onDelete={handleDeleteImagePostByPublicId}
                                disabled={publishPost.isPending || uploadImagePost.isPending}
                                maxCount={10}
                                title="Upload photos"
                                description="You can upload up to 10 images"
                            />
                        )}
                    </div>
                </div>

                <Separator />

                {/* footer */}
                <DialogFooter className="fle">
                    <ButtonLoading
                        onClick={() => {
                            if (type === "create") handleCreatePost();
                            if (type === "edit") handleUpdatePost();
                        }}
                        loading={publishPost.isPending}
                        disabled={
                            publishPost.isPending ||
                            uploadImagePost.isPending ||
                            deleteImagePostByPublicId.isPending ||
                            loadingUpsertPostDraft ||
                            postEdit.isPending
                        }
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-2 text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {type === "create" ? "Post" : "Update"}
                    </ButtonLoading>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ["Tabbicus/articles/posts/fo6mw9mgffgyihqmoozm"]
// ["Tabbicus/articles/posts/fo6mw9mgffgyihqmoozm","Tabbicus/articles/posts/u1ik8dflnob6t3jbg5vi"]
