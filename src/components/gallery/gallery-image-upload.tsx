"use client";

import { useGalleryImageEdit, usePublishGalleryImage, useUpsertGalleryImageDarft, useUpsertThumbnail } from "@/api/tantask/gallery-image.tanstack";
import { Container } from "@/components/container/container";
import { Textarea } from "@/components/textarea/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY } from "@/constant/app.constant";
import { ROUTER_CLIENT } from "@/constant/router.constant";
import { TResAction } from "@/types/app.type";
import { TArticle, TPublishArticleReq } from "@/types/article.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebouncedCallback } from "@mantine/hooks";
import { Separator } from "@radix-ui/react-separator";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import ImageUpload from "../image-upload/image-upload";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ButtonLoading } from "../ui/button-loading";
import { formatLocalTime, resError } from "@/helpers/function.helper";
import { toast } from "sonner";

const FormSchema = z.object({
    title: z.string().nonempty("Title is required."),
    content: z.string().nonempty("Description is required."),
    thumbnail: z.any().optional(),
});

type TProps = {
    type: "create" | "edit";
    dataArticle: TResAction<TArticle | null>;
};

export default function GalleryImageUpload({ dataArticle, type }: TProps) {
    const { data: article } = dataArticle;

    const router = useRouter();
    const firstRunRef = useRef(true);
    const [isRemoveThumbnail, setIsRemoveThumbnail] = useState(false);

    const upsertThumbnail = useUpsertThumbnail();
    const upsertGalleryImageDarft = useUpsertGalleryImageDarft();
    const publishGalleryImage = usePublishGalleryImage();
    const galleryImageEdit = useGalleryImageEdit();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: article?.title ?? "",
            content: article?.content ?? "",
            thumbnail: article?.thumbnail ?? "",
        },
    });

    if (type === "create") {
        const values = useWatch({ control: form.control });
        const handleUpsert = useDebouncedCallback(
            async (query: any) => {
                console.log({ query });
                if (firstRunRef.current) return (firstRunRef.current = false);

                upsertGalleryImageDarft.mutate({
                    title: query.title,
                    content: query.content,
                });
            },
            {
                delay: 1000,
                leading: false,
                flushOnUnmount: true,
            }
        );
        useEffect(() => {
            handleUpsert(values);
        }, [values]);
    }

    function onSubmitCreate(data: z.infer<typeof FormSchema>) {
        console.log({ data });
        if (upsertGalleryImageDarft.isPending) return;

        const payload: TPublishArticleReq = {
            title: data.title.trim(),
        };

        publishGalleryImage.mutate(payload, {
            onSuccess: () => {
                form.reset({
                    title: "",
                    content: "",
                    thumbnail: "",
                });
            },
            onError: (error) => {
                toast.error(resError(error, `Publish Image failed`));
            },
        });
    }

    function onSubmitEdit(data: z.infer<typeof FormSchema>) {
        if (galleryImageEdit.isPending || !article) return;

        const formData = new FormData();

        const values = form.getValues();
        const dirty = form.formState.dirtyFields as any;

        const push = (key: string, value: any) => {
            if (value === undefined || value === null || !value) return;
            if (Array.isArray(value)) {
                value.forEach((item) => formData.append(key, String(item))); // mảng -> lặp key (Nest nhận string[])
            } else {
                formData.append(key, value);
            }
        };

        if (dirty.title) push("title", values.title.trim());
        if (dirty.content) push("content", values.content);
        if (dirty.thumbnail) push("thumbnail", values.thumbnail);
        formData.append("isRemoveThumbnail", isRemoveThumbnail.toString());

        console.log({ formData });
        console.log(`title`, formData.getAll(`title`));
        console.log(`content`, formData.getAll(`content`));
        console.log(`thumbnail`, formData.getAll(`thumbnail`));
        console.log(`isRemoveThumbnail`, formData.getAll(`isRemoveThumbnail`));

        galleryImageEdit.mutate(
            { id: article.id, formData: formData },
            {
                onError: (error) => {
                    toast.error(resError(error, `Image edit failed`));
                },
            }
        );
    }

    const onUpload = async (file: File) => {
        const fd = new FormData();
        fd.append("thumbnail", file);
        // mutation phải trả về publicId (string)
        return await upsertThumbnail.mutateAsync(fd);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(type === "create" ? onSubmitCreate : onSubmitEdit)}>
                <div className="h-[calc(100dvh-var(--header-height))] flex flex-col">
                    {/* header */}
                    <div className="relative bg-background flex items-center justify-between w-full px-3 py-3 shadow-sm">
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                onClick={() => {
                                    router.push(ROUTER_CLIENT.HOME);
                                }}
                                variant="link"
                                size={"sm"}
                                className="text-muted-foreground"
                            >
                                <ArrowLeft />
                                Back to Home
                            </Button>
                            <Separator orientation="vertical" className="!h-[20px]" />
                            <p className="text-lg font-semibold">{type === "create" ? "Create Image" : "Edit Image"}</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="relative">
                                {type === "create" && (
                                    <ButtonLoading loading={publishGalleryImage.isPending} type="submit" className="w-[100px]">
                                        Post
                                    </ButtonLoading>
                                )}
                                {type === "edit" && (
                                    <ButtonLoading
                                        disabled={galleryImageEdit.isPending || !form.formState.isDirty}
                                        loading={galleryImageEdit.isPending}
                                        type="submit"
                                        className="w-[100px]"
                                    >
                                        Edit
                                    </ButtonLoading>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* body */}
                    <div className="flex-1 overflow-y-auto">
                        <Container className="py-4 sm:py-6 lg:py-8">
                            <div className="w-full max-w-2xl mx-auto bg-background rounded-2xl shadow-sm p-5 flex flex-col gap-5">
                                {/* thumbnail */}
                                <FormField
                                    control={form.control}
                                    name="thumbnail"
                                    render={({ field }) => {
                                        const previewUrl =
                                            typeof field.value === "string" && field.value
                                                ? `${NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY}/${field.value}`
                                                : undefined;
                                        return (
                                            <FormItem>
                                                <FormControl>
                                                    <ImageUpload
                                                        value={previewUrl}
                                                        {...(type === "create"
                                                            ? {
                                                                  onSuccessToServer: (id) => {
                                                                      field.onChange(id);
                                                                      field.onBlur();
                                                                  },
                                                                  onUploadToServer: onUpload,
                                                                  isUploading: upsertThumbnail.isPending,
                                                              }
                                                            : {})}
                                                        {...(type === "edit"
                                                            ? {
                                                                  onUploadToLocal: (file: File | null) => {
                                                                      field.onBlur();
                                                                      field.onChange(file ?? "");
                                                                  },
                                                                  onDelete: () => {
                                                                      field.onBlur();
                                                                      field.onChange("");
                                                                      setIsRemoveThumbnail(true);
                                                                  },
                                                              }
                                                            : {})}
                                                        onUploadError={(e) => {
                                                            console.error(e);
                                                        }}
                                                        // tuỳ chọn giao diện
                                                        className="w-full h-[400px]"
                                                        title={`Add a featured image`}
                                                        description={`Drag and drop an image, or click to browse`}
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-xs italic">
                                                    This image represents your article in listings and previews. Choose one that is clear and
                                                    relevant.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />

                                {/* title */}
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem className="h-[75px] content-start gap-1">
                                            <FormLabel className="mb-[3px] text-muted-foreground">Title</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input placeholder="Give your article a title" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="leading-none text-xs" />
                                        </FormItem>
                                    )}
                                />

                                {/* description */}
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem className="content-start gap-1">
                                            <FormLabel className="mb-[3px] text-muted-foreground">Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    id="content"
                                                    {...field}
                                                    placeholder="Tell us about this image..."
                                                    className="mt-1 min-h-[100px] pb-7"
                                                    maxLength={100}
                                                    maxRows={5}
                                                />
                                            </FormControl>
                                            <FormMessage className="leading-none text-xs" />
                                        </FormItem>
                                    )}
                                />

                                {type === "create" && (
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs text-muted-foreground italic">Last updated:</p>
                                        {upsertGalleryImageDarft.isPending ? (
                                            <Loader2 className="animate-spin w-4 h-4 text-muted-foreground" />
                                        ) : (
                                            <p className="text-xs text-muted-foreground italic">
                                                {formatLocalTime(upsertGalleryImageDarft.data?.updatedAt || article?.updatedAt, "ago")}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Container>
                    </div>
                </div>
            </form>
        </Form>
    );
}
