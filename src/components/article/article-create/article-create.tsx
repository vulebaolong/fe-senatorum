"use client";

import { useCreateArticle } from "@/api/tantask/article.tanstack";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/button-loading";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ROUTER_CLIENT } from "@/constant/router.constant";
import { resError } from "@/helpers/function.helper";
import { cn } from "@/lib/utils";
import { TCreateArticleReq } from "@/types/article.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { $createParagraphNode, $getRoot, LexicalEditor } from "lexical";
import { ArrowLeft, Eye, Globe, Settings, Tag } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Editor from "../../lexical/editor";
import { CategoryMultiSelect } from "./select/category-multi-select";
import TypeSelect from "./select/type-select";
import Thumbnail from "./thumbnail/thumbnail";
import { useRouter } from "next/navigation";

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

export default function ArticleCreate() {
    const createArticle = useCreateArticle();
    const editorRef = useRef<LexicalEditor | null>(null);
    const router = useRouter();
    const [settingsOpen, setSettingsOpen] = useState(true);
    const [preview, setPreview] = useState<string | null>(null);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: ``,
            typeId: ``,
            categoryIds: [],
            content: ``,
            thumbnail: ``,
        },
    });

    console.log({ form, errors: form.formState.errors, values: form.getValues() });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        const payload: TCreateArticleReq = {
            ...data,
            typeId: Number(data.typeId),
        };

        console.log({ payload });

        createArticle.mutate(payload, {
            onSuccess: () => {
                toast.success(`Create article successfully`);

                form.reset();

                editorRef.current?.update(() => {
                    const root = $getRoot(); // Lấy node gốc của document
                    root.clear(); // Xóa hết nội dung hiện có trong editor
                    root.append($createParagraphNode()); // Tạo đoạn văn bản trống (giống như <p></p>)
                });

                setPreview((old) => {
                    if (old) URL.revokeObjectURL(old);
                    return null;
                });
            },
            onError: (error) => {
                toast.error(resError(error, `Create article failed`));
            },
        });
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
                                                    <Thumbnail preview={preview} setPreview={setPreview} onUploadThumbnail={field.onChange} />
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
                                                    <Editor onChange={field.onChange} editorRef={editorRef} />
                                                </div>
                                                <FormDescription className="text-xs italic">
                                                    Write the main body of your article here. Make it informative, structured, and engaging
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <ButtonLoading loading={createArticle.isPending} type="submit" className="w-full">
                                        Create
                                    </ButtonLoading>
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
                                                        <Tag size={16} />
                                                        <p>Type</p>
                                                    </FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Select a type article" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <TypeSelect />
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
                                                        <Tag size={16} />
                                                        <p>Category</p>
                                                    </FormLabel>
                                                    <CategoryMultiSelect value={field.value || []} onChange={field.onChange} />
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
