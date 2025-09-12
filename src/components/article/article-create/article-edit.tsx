"use client";

import { useArticleEdit } from "@/api/tantask/article.tanstack";
import ImageUpload from "@/components/image-upload/image-upload";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/button-loading";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY } from "@/constant/app.constant";
import { ROUTER_CLIENT } from "@/constant/router.constant";
import { resError } from "@/helpers/function.helper";
import { cn } from "@/lib/utils";
import { TResAction } from "@/types/app.type";
import { TArticle } from "@/types/article.type";
import { TCategory } from "@/types/category.type";
import { TType } from "@/types/type.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { LexicalEditor } from "lexical";
import { ArrowLeft, Settings, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Editor from "../../lexical/editor";
import { CategoryMultiSelect } from "./select/category-multi-select";
import TypeSelect from "./select/type-select";

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
    thumbnail: z.union([z.string(), z.file()]).optional(),
});

type TProps = {
    dataArticle: TResAction<TArticle | null>;
    dataListTypeArticle: TResAction<TType[] | null>;
    dataListCategoryArticle: TResAction<TCategory[] | null>;
};

export default function ArticleEdit({ dataArticle, dataListTypeArticle, dataListCategoryArticle }: TProps) {
    const { data: article } = dataArticle;
    const { data: listTypeArticle } = dataListTypeArticle;
    const { data: listCategoryArticle } = dataListCategoryArticle;

    const articleEdit = useArticleEdit();
    const editorRef = useRef<LexicalEditor | null>(null);
    const router = useRouter();
    const [settingsOpen, setSettingsOpen] = useState(true);

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

    function onSubmit(data: z.infer<typeof FormSchema>) {
        if (articleEdit.isPending || !article) return;

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
        if (dirty.typeId) push("typeId", values.typeId);
        if (dirty.categoryIds) push("categoryIds", values.categoryIds);
        // if (values.thumbnail instanceof File) push("thumbnail", values.thumbnail);
        if (dirty.thumbnail) push("thumbnail", values.thumbnail);

        // console.log({ formData });
        // console.log(`title`, formData.getAll(`title`));
        // console.log(`content`, formData.getAll(`content`));
        // console.log(`typeId`, formData.getAll(`typeId`));
        // console.log(`categoryIds`, formData.getAll(`categoryIds`));
        // console.log(`thumbnail`, formData.getAll(`thumbnail`));

        articleEdit.mutate(
            { id: article.id, formData: formData },
            {
                onError: (error) => {
                    toast.error(resError(error, `Article edit failed`));
                },
            }
        );
    }

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
                            <p className="text-lg font-semibold">{"Edit Article"}</p>
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
                                                            onUploadToLocal={(file: File | null) => {
                                                                field.onBlur();
                                                                field.onChange(file ?? "");
                                                            }}
                                                            onUploadError={(e) => {
                                                                console.error(e);
                                                            }}
                                                            onDelete={async () => {
                                                                field.onBlur();
                                                                field.onChange("");
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
                                            );
                                        }}
                                    />

                                    {/* content */}
                                    <FormField
                                        control={form.control}
                                        name="content"
                                        render={({ field }) => (
                                            <FormItem>
                                                {/* <FormLabel>Content</FormLabel> */}
                                                <div className="rounded-2xl border">
                                                    <Editor initialContentJSON={article?.content} onChange={field.onChange} editorRef={editorRef} />
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
                                        <ButtonLoading
                                            disabled={articleEdit.isPending || !form.formState.isDirty}
                                            loading={articleEdit.isPending}
                                            type="submit"
                                            className="w-[200px]"
                                        >
                                            Update
                                        </ButtonLoading>
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
                    </div>
                </div>
            </form>
        </Form>
    );
}
