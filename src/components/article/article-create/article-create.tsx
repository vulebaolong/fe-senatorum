"use client";

import { useCreateArticle, useUpsertArticle } from "@/api/tantask/article.tanstack";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/button-loading";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY } from "@/constant/app.constant";
import { ROUTER_CLIENT } from "@/constant/router.constant";
import { formatLocalTime } from "@/helpers/function.helper";
import { cn } from "@/lib/utils";
import { TResAction, TResPagination } from "@/types/app.type";
import { TArticle, TCreateArticleReq } from "@/types/article.type";
import { TType } from "@/types/type.type";
import { useDebouncedCallback } from "@mantine/hooks";
import { LexicalEditor } from "lexical";
import { ArrowLeft, Eye, Globe, Loader2, Settings, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import Editor from "../../lexical/editor";
import { CategoryMultiSelect } from "./select/category-multi-select";
import TypeSelect from "./select/type-select";
import Thumbnail from "./thumbnail/thumbnail";
import { TCategory } from "@/types/category.type";

const FormSchema = z.object({
    title: z.string().nonempty("Title is required."),
    typeId: z.string().nonempty("Type is required."),
    categoryIds: z.array(z.number()).min(1, "Select at least one category.").max(3, "You can select up to 3 categories."),
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
    thumbnail: z.string().nonempty("Thumbnail is required."),
});

type TProps = {
    dataArticleDaft: TResAction<TArticle | null>;
    dataListTypeArticle: TResAction<TResPagination<TType> | null>;
    dataListCategoryArticle: TResAction<TResPagination<TCategory> | null>;
};

export default function ArticleCreate({ dataArticleDaft, dataListTypeArticle, dataListCategoryArticle }: TProps) {
    const { data: articleDaft } = dataArticleDaft;
    const { data: listTypeArticle } = dataListTypeArticle;
    const { data: listCategoryArticle } = dataListCategoryArticle;

    const upsertArticle = useUpsertArticle();
    const createArticle = useCreateArticle();
    const editorRef = useRef<LexicalEditor | null>(null);
    const router = useRouter();
    const [settingsOpen, setSettingsOpen] = useState(true);
    const firstRunRef = useRef(true);

    const form = useForm<z.infer<typeof FormSchema>>({
        defaultValues: {
            title: articleDaft?.title ?? "",
            content: articleDaft?.content ?? "",
            thumbnail: articleDaft?.thumbnail ?? "",
            typeId: articleDaft?.typeId?.toString() ?? "",
            categoryIds: articleDaft?.ArticleCategories?.map((item) => item.Categories.id) ?? [],
        },
    });
    const values = useWatch({ control: form.control });

    const handleUpsert = useDebouncedCallback(async (query: any) => {
        if (firstRunRef.current) return (firstRunRef.current = false);

        console.log({ query });
        upsertArticle.mutate({
            title: query.title,
            content: query.content,
            thumbnail: query.thumbnail,
            typeId: Number(query.typeId) || undefined,
            categoryIds: query.categoryIds,
        });
    }, 500);
    useEffect(() => {
        handleUpsert(values);
    }, [values]);

    function onSubmit(data: z.infer<typeof FormSchema>) {
        const payload: TCreateArticleReq = {
            ...data,
            typeId: Number(data.typeId),
        };

        console.log({ payload });

        // createArticle.mutate(payload, {
        //     onSuccess: () => {
        //         toast.success(`Create article successfully`);

        //         form.reset();

        //         editorRef.current?.update(() => {
        //             const root = $getRoot(); // Lấy node gốc của document
        //             root.clear(); // Xóa hết nội dung hiện có trong editor
        //             root.append($createParagraphNode()); // Tạo đoạn văn bản trống (giống như <p></p>)
        //         });

        //         setPreview((old) => {
        //             if (old) URL.revokeObjectURL(old);
        //             return null;
        //         });
        //     },
        //     onError: (error) => {
        //         toast.error(resError(error, `Create article failed`));
        //     },
        // });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="h-[calc(100vh-var(--header-height))] flex flex-col">
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
                            <p className="text-lg font-semibold">Create New Article</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button type="button" onClick={() => setSettingsOpen((v) => !v)} variant="outline" size={"sm"}>
                                <Settings />
                                Settings
                            </Button>
                            <Button type="button" variant="outline" size={"sm"}>
                                <Eye />
                                Preview
                            </Button>
                            <Button type="button" variant="default" size={"sm"}>
                                <Globe />
                                Public
                            </Button>
                        </div>
                    </div>

                    {/* body */}
                    <div className="flex-1 p-5 overflow-y-auto">
                        <div className={`flex`}>
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
                                                    <Thumbnail
                                                        value={field.value || ""}
                                                        onChange={(v) => field.onChange(v || "")}
                                                        toUrl={(id) => `${NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY}${id}`} // publicId -> URL
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
                                                        initialContentJSON={articleDaft?.content}
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

                                    <div className="">
                                        <ButtonLoading loading={createArticle.isPending} type="submit" className="w-[170px]">
                                            Publish
                                        </ButtonLoading>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs text-muted-foreground italic">Last updated:</p>
                                            {upsertArticle.isPending ? (
                                                <Loader2 className="animate-spin w-4 h-4 text-muted-foreground" />
                                            ) : (
                                                <p className="text-xs text-muted-foreground italic">
                                                    {formatLocalTime(articleDaft?.updatedAt, "ago")}
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
                                        "will-change-transform transition-all duration-300 pl-5",
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
                                                    <Select onValueChange={field.onChange} value={field.value}>
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
