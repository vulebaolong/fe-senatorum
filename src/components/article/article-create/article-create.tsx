"use client";

import { MDXEditorMethods } from "@mdxeditor/editor";
import { useRef } from "react";
import { ForwardRefEditor } from "./mdx-editor/forward-ref-editor";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { ButtonLoading } from "@/components/ui/button-loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoryMultiSelect } from "./category-multi-select";
import { TCategory } from "@/types/category.type";

export const categories: TCategory[] = [
    {
        id: "1",
        name: "Frontend",
        slug: "frontend",
        description: "UI/UX & JS frameworks",
        isDeleted: false,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
    },
    {
        id: "2",
        name: "Backend",
        slug: "backend",
        description: "Server, Database & API",
        isDeleted: false,
        createdAt: "2024-01-02T00:00:00Z",
        updatedAt: "2024-01-02T00:00:00Z",
    },
    {
        id: "3",
        name: "DevOps",
        slug: "devops",
        description: "CI/CD, Docker, Infrastructure",
        isDeleted: false,
        createdAt: "2024-01-03T00:00:00Z",
        updatedAt: "2024-01-03T00:00:00Z",
    },
    {
        id: "4",
        name: "AI",
        slug: "ai",
        description: "Artificial Intelligence & Machine Learning",
        isDeleted: false,
        createdAt: "2024-01-04T00:00:00Z",
        updatedAt: "2024-01-04T00:00:00Z",
    },
    {
        id: "5",
        name: "Mobile",
        slug: "mobile",
        description: "React Native, Flutter, mobile UX",
        isDeleted: false,
        createdAt: "2024-01-05T00:00:00Z",
        updatedAt: "2024-01-05T00:00:00Z",
    },
    {
        id: "6",
        name: "Design",
        slug: "design",
        description: "Figma, prototyping, design systems",
        isDeleted: false,
        createdAt: "2024-01-06T00:00:00Z",
        updatedAt: "2024-01-06T00:00:00Z",
    },
    {
        id: "7",
        name: "Testing",
        slug: "testing",
        description: "Unit, Integration, E2E testing tools",
        isDeleted: false,
        createdAt: "2024-01-07T00:00:00Z",
        updatedAt: "2024-01-07T00:00:00Z",
    },
];

const categorySchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    description: z.string(),
});

const FormSchema = z.object({
    email: z.email({ message: "Email không hợp lệ" }),
    type: z.string(),
    categories: z.array(categorySchema).min(1, "Chọn ít nhất 1 danh mục").max(3, "Chỉ được chọn tối đa 3 danh mục"),
});

export default function ArticleCreate() {
    const editorRef = useRef<MDXEditorMethods>(null);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: `example@gmail.com`,
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        const payload = {
            email: data.email.trim(),
        };

        console.log({ payload });
        //   useloginForm.mutate(payload, {
        //       onSuccess: (data) => {
        //           console.log({ data });
        //           if (data.isTotp) {
        //               // setStep(`login-google-authentication`);
        //           } else {
        //               router.push(ROUTER_CLIENT.HOME);
        //               toast.success(`Login successfully`);
        //           }
        //       },
        //   });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-5 h-[calc(100vh-var(--header-height))] flex flex-col gap-5">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
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
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="min-w-[180px]">
                                        <SelectValue placeholder="Select a type article" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="m@example.com">Analysis</SelectItem>
                                    <SelectItem value="m@google.com">Analysis</SelectItem>
                                    <SelectItem value="m@support.com">Analysis</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription className="text-xs italic">
                                Type articles by purpose like blogs, tutorials, product updates, etc.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="categories"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <CategoryMultiSelect
                                value={(field.value as TCategory[]) || []}
                                onChange={field.onChange}
                                options={categories} // từ BE
                            />
                            <FormDescription className="text-xs italic">
                                Categorize posts by purpose like blogs, tutorials, product updates, etc.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="overflow-y-auto flex-1">
                    <ForwardRefEditor ref={editorRef} markdown="# Hello world" onChange={(md) => console.log(md)} />
                </div>
                <ButtonLoading loading={false} type="submit" className="w-full">
                    Create
                </ButtonLoading>
            </form>
        </Form>
    );
}
