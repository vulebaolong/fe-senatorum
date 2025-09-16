"use client";

import { usePublishArticle, useUpsertArticleDarft, useUpsertArticleEdit } from "@/api/tantask/article.tanstack";
import { useUpsertThumbnail } from "@/api/tantask/image.tanstack";
import ImageUpload from "@/components/image-upload/image-upload";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/button-loading";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY } from "@/constant/app.constant";
import { ROUTER_CLIENT } from "@/constant/router.constant";
import { formatLocalTime, resError } from "@/helpers/function.helper";
import { cn } from "@/lib/utils";
import { TResAction } from "@/types/app.type";
import { TArticle, TPublishArticleReq } from "@/types/article.type";
import { TCategory } from "@/types/category.type";
import { TType } from "@/types/type.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebouncedCallback } from "@mantine/hooks";
import { $createParagraphNode, $getRoot, LexicalEditor } from "lexical";
import { ArrowLeft, Loader2, Settings, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Editor from "../../lexical/editor";
import { CategoryMultiSelect } from "./select/category-multi-select";
import TypeSelect from "./select/type-select";
import { Container } from "@/components/container/container";

const FormSchema = z.object({
    title: z.string().nonempty("Title is required."),
    typeId: z.string().nonempty("Type is required."),
    categoryIds: z.array(z.string()).nonempty("Category is required."),
    content: z.string().refine(
        (val) => {
            try {
                const parsed = JSON.parse(val);
                const children = parsed?.root?.children ?? [];
                return children.some((node: any) => {
                    if (node.type === "paragraph" && Array.isArray(node.children)) {
                        return node.children.some((child: any) => child.text?.trim() !== "");
                    }
                    return true;
                });
            } catch (error) {
                console.log(error);
                return false;
            }
        },
        {
            message: "Content must not be empty.",
        }
    ),
    thumbnail: z.string(),
});

type TProps = {
    type: "create" | "edit";
    dataArticle: TResAction<TArticle | null>;
    dataListTypeArticle: TResAction<TType[] | null>;
    dataListCategoryArticle: TResAction<TCategory[] | null>;
};

export default function ArticleCreate({ type, dataArticle, dataListTypeArticle, dataListCategoryArticle }: TProps) {
    const { data: article } = dataArticle;
    const { data: listTypeArticle } = dataListTypeArticle;
    const { data: listCategoryArticle } = dataListCategoryArticle;

    const upsertArticleDarft = useUpsertArticleDarft();
    const upsertArticleEdit = useUpsertArticleEdit();
    const publishArticle = usePublishArticle();
    const upsertThumbnail = useUpsertThumbnail();
    const editorRef = useRef<LexicalEditor | null>(null);
    const router = useRouter();
    const [settingsOpen, setSettingsOpen] = useState(true);
    const firstRunRef = useRef(true);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: article?.title ?? "",
            content: article?.content ?? "",
            thumbnail: article?.thumbnail ?? "",
            typeId: article?.typeId?.toString() ?? "",
            categoryIds: article?.ArticleCategories?.map((item) => item.Categories.id) ?? [],
        },
    });

    const values = useWatch({ control: form.control });
    const handleUpsert = useDebouncedCallback(
        async (query: any) => {
            if (firstRunRef.current) return (firstRunRef.current = false);

            switch (type) {
                case "create":
                    console.log({ Debounce: query });
                    upsertArticleDarft.mutate({
                        title: query.title,
                        content: query.content,
                        thumbnail: query.thumbnail,
                        typeId: query.typeId || undefined,
                        categoryIds: query.categoryIds,
                    });
                    break;

                case "edit":
                    if (!article) return;

                    upsertArticleEdit.mutate({
                        id: article.id,
                        title: query.title,
                        content: query.content,
                        thumbnail: query.thumbnail,
                        typeId: query.typeId || undefined,
                        categoryIds: query.categoryIds,
                    });
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
        handleUpsert(values);
    }, [values]);

    function onSubmit(data: z.infer<typeof FormSchema>) {
        if (upsertArticleDarft.isPending) return;

        const payload: TPublishArticleReq = {
            title: data.title.trim(),
        };

        console.log({ payload, data });

        publishArticle.mutate(payload, {
            onSuccess: () => {
                form.reset({
                    title: "",
                    content: "",
                    thumbnail: "",
                    typeId: "",
                    categoryIds: [],
                });

                console.log(form.getValues());

                editorRef.current?.update(() => {
                    const root = $getRoot();
                    root.clear();
                    const p = $createParagraphNode();
                    root.append(p);
                    p.select(); // << đặt selection vào paragraph, tránh root
                });
            },
            onError: (error) => {
                toast.error(resError(error, `Publish Article failed`));
            },
        });
    }

    const onUpload = async (file: File) => {
        const fd = new FormData();
        fd.append("thumbnail", file);
        // mutation phải trả về publicId (string)
        return await upsertThumbnail.mutateAsync(fd);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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
                                Back to Articles
                            </Button>
                            <Separator orientation="vertical" className="!h-[20px]" />
                            <p className="text-lg font-semibold">{type === "create" ? "Create Article" : "Edit Article"}</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button type="button" onClick={() => setSettingsOpen((v) => !v)} variant="outline" size={"sm"}>
                                <Settings />
                                Settings
                            </Button>
                            {/* <Button type="button" variant="outline" size={"sm"}>
                                <Eye />
                                Preview
                            </Button>
                            <Button type="button" variant="default" size={"sm"}>
                                <Globe />
                                Public
                            </Button> */}
                        </div>
                    </div>

                    {/* body */}
                    <div className="flex-1 p-5 overflow-y-auto">
                        <Container>
                            <div className={cn("flex flex-col", "lg:flex-row")}>
                                {/* LEFT */}
                                <div className="flex-1 min-w-0 transition-[width] duration-300">
                                    <div className="w-full bg-background rounded-2xl shadow-sm p-5 flex flex-col gap-5">
                                        {/* title */}
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Article title..."
                                                            {...field}
                                                            className="h-auto !text-3xl font-bold border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none !bg-transparent px-0"
                                                        />
                                                    </FormControl>
                                                    <FormDescription className="text-xs italic">
                                                        The title appears at the top of your article and in search results. It should be clear and
                                                        compelling.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* thumbnail */}
                                        <FormField
                                            control={form.control}
                                            name="thumbnail"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <ImageUpload
                                                            value={!field.value ? "" : `${NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY}/${field.value}`} // publicId hiện tại
                                                            onSuccessToServer={(id) => {
                                                                // ghi về form
                                                                field.onChange(id);
                                                                field.onBlur(); // mark as touched (hữu ích cho validate)
                                                            }}
                                                            onUploadToServer={onUpload} // gọi tanstack bên ngoài
                                                            isUploading={upsertThumbnail.isPending}
                                                            onUploadError={(e) => {
                                                                // tuỳ bạn: toast.error(...)
                                                                console.error(e);
                                                            }}
                                                            onDelete={async () => {
                                                                // nếu cần gọi API xoá file trên server, làm ở đây
                                                                // await api.delete(publicId)
                                                            }}
                                                            // tuỳ chọn giao diện
                                                            className="w-full h-[300px]"
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
                                            )}
                                        />

                                        {/* content */}
                                        <FormField
                                            control={form.control}
                                            name="content"
                                            render={({ field }) => (
                                                <FormItem>
                                                    {/* <FormLabel>Content</FormLabel> */}
                                                    <div className="rounded-2xl border">
                                                        <Editor
                                                            initialContentJSON={article?.content}
                                                            onChange={field.onChange}
                                                            editorRef={editorRef}
                                                        />
                                                    </div>
                                                    <FormDescription className="text-xs italic">
                                                        Write the main body of your article here. Make it informative, structured, and engaging
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Separator />

                                        <div>
                                            {type === "create" && (
                                                <ButtonLoading loading={publishArticle.isPending} type="submit" className="w-[200px]">
                                                    Publish
                                                </ButtonLoading>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs text-muted-foreground italic">Last updated:</p>
                                                {upsertArticleDarft.isPending || upsertArticleEdit.isPending ? (
                                                    <Loader2 className="animate-spin w-4 h-4 text-muted-foreground" />
                                                ) : (
                                                    <p className="text-xs text-muted-foreground italic">
                                                        {formatLocalTime(
                                                            upsertArticleDarft.data?.updatedAt ||
                                                                upsertArticleEdit.data?.updatedAt ||
                                                                article?.updatedAt,
                                                            "ago"
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT (sidebar) */}
                                <div
                                    className="sticky top-0 h-fit overflow-hidden transition-[flex-basis] duration-300 ease-out"
                                    style={{ flexBasis: settingsOpen ? "360px" : "0px", willChange: "flex-basis" }}
                                    aria-hidden={!settingsOpen}
                                >
                                    <div
                                        className={cn(
                                            "w-full shrink-0",
                                            "will-change-transform transition-all duration-300 pt-5",
                                            "lg:pl-5 lg:pt-0 lg:w-[360px]",
                                            settingsOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"
                                        )}
                                    >
                                        <div className="p-5 flex flex-col gap-5 bg-background rounded-2xl shadow-sm">
                                            {/* title */}
                                            <div className="flex items-center gap-2">
                                                <Settings />
                                                <p className="text-lg font-semibold">Article Settings</p>
                                            </div>

                                            {/* type */}
                                            <FormField
                                                control={form.control}
                                                name="typeId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2">
                                                            <Tag size={16} className="text-muted-foreground" />
                                                            <p className="font-bold text-muted-foreground">Type</p>
                                                        </FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                                            <FormControl>
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Select a type article" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <TypeSelect listTypeArticle={listTypeArticle} />
                                                        </Select>
                                                        <FormDescription className="text-xs italic">
                                                            Type articles by purpose like blogs, tutorials, product updates, etc.
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* categories */}
                                            <FormField
                                                control={form.control}
                                                name="categoryIds"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2">
                                                            <Tag size={16} className="text-muted-foreground" />
                                                            <p className="font-bold text-muted-foreground">Category</p>
                                                        </FormLabel>
                                                        <CategoryMultiSelect
                                                            value={field.value || []}
                                                            onChange={field.onChange}
                                                            listCategoryArticle={listCategoryArticle}
                                                        />
                                                        <FormDescription className="text-xs italic">
                                                            Categorize posts by purpose like blogs, tutorials, product updates, etc.
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        {/* <div className="bg-background rounded-2xl shadow-sm h-[300px]">123</div> */}
                                    </div>
                                </div>
                            </div>
                        </Container>
                    </div>
                </div>
            </form>
        </Form>
    );
}
