"use client";

import { useCreateArticle } from "@/api/tantask/article.tanstack";
import { ButtonLoading } from "@/components/ui/button-loading";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { resError } from "@/helpers/function.helper";
import { TCreateArticleReq } from "@/types/article.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { $createParagraphNode, $getRoot, LexicalEditor } from "lexical";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Editor from "../../lexical/editor";
import { CategoryMultiSelect } from "./select/category-multi-select";
import TypeSelect from "./select/type-select";

const FormSchema = z.object({
    title: z.string().nonempty(),
    typeId: z.string().nonempty(),
    categoryIds: z.array(z.number()).min(1, "Chọn ít nhất 1 danh mục").max(3, "Chỉ được chọn tối đa 3 danh mục"),
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
            message: "Nội dung không được để trống",
        }
    ),
});

export default function ArticleCreate() {
    const createArticle = useCreateArticle();
    const editorRef = useRef<LexicalEditor | null>(null);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: ``,
            typeId: ``,
            categoryIds: [],
            content: ``,
        },
    });

    console.log({ form, errors: form.formState.errors, values: form.getValues() });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        const payload: TCreateArticleReq = {
            ...data,
            thumbnail: "https://res.cloudinary.com/vulebaolong/image/upload/v1751599817/articles/gjlmckp9g7v1koq0q3wy.jpg",
            typeId: Number(data.typeId),
        };

        console.log({ payload });

        createArticle.mutate(payload, {
            onSuccess: (data) => {
                form.reset();
                toast.success(`Create article successfully`);

                editorRef.current?.update(() => {
                    const root = $getRoot(); // Lấy node gốc của document
                    root.clear(); // Xóa hết nội dung hiện có trong editor
                    root.append($createParagraphNode()); // Tạo đoạn văn bản trống (giống như <p></p>)
                });
            },
            onError: (error) => {
                toast.error(resError(error, `Create article failed`));
            },
        });
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="px-5 pb-5 h-[calc(100vh-var(--header-height))] flex flex-col gap-5 overflow-y-auto"
            >
                {/* email */}
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem className="mt-5">
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Title" {...field} />
                            </FormControl>
                            <FormDescription className="text-xs italic">
                                The title appears at the top of your article and in search results. It should be clear and compelling.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* type */}
                <FormField
                    control={form.control}
                    name="typeId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger className="min-w-[180px]">
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
                            <FormLabel>Category</FormLabel>
                            <CategoryMultiSelect value={field.value || []} onChange={field.onChange} />
                            <FormDescription className="text-xs italic">
                                Categorize posts by purpose like blogs, tutorials, product updates, etc.
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
                            <FormLabel>Content</FormLabel>
                            <div className="rounded-lg border">
                                <Editor onChange={field.onChange} editorRef={editorRef} />
                            </div>
                            {/* <div className="flex-1 h-fit relative">
                                <ForwardRefEditor ref={editorRef} markdown={field.value} onChange={field.onChange} />
                                <Badge variant={"outline"} className="absolute bottom-[5px] right-[5px]">
                                    count: {field.value.trim().length}
                                </Badge>
                            </div> */}
                            <FormDescription className="text-xs italic">
                                Categorize posts by purpose like blogs, tutorials, product updates, etc.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <ButtonLoading loading={createArticle.isPending} type="submit" className="w-full">
                    Create
                </ButtonLoading>
            </form>
        </Form>
    );
}
