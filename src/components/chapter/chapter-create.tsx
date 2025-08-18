"use client";

import { usePublishChapter, useUpsertBanner, useUpsertChapter } from "@/api/tantask/chapter.tanstack";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ROUTER_CLIENT } from "@/constant/router.constant";
import { formatLocalTime, resError, toUrl } from "@/helpers/function.helper";
import { cn } from "@/lib/utils";
import { TResAction } from "@/types/app.type";
import { TChapter, TPublishChapterReq } from "@/types/chapter.type";
import { ChapterStatus } from "@/types/enum/chapter.enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebouncedCallback } from "@mantine/hooks";
import { ArrowLeft, Eye, Globe, ImageIcon, Loader2, Settings, Zap } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import ImageUpload from "../image-upload/image-upload";
import { Textarea } from "../textarea/textarea";
import { TitleBox } from "../title/title-box";
import { ButtonLoading } from "../ui/button-loading";
import { Switch } from "../ui/switch";

const FormSchema = z.object({
    name: z.string().nonempty("Title is required."),
    description: z.string().nonempty("Type is required."),
    isApprovalRequired: z.boolean(),
    banner: z.string(),
});

type TProps = {
    dataChapterDaft: TResAction<TChapter | null>;
};

export default function ChapterCreate({ dataChapterDaft }: TProps) {
    const { data: chapterDaft } = dataChapterDaft;

    const upsertChapter = useUpsertChapter();
    const upsertBanner = useUpsertBanner();
    const publishChapter = usePublishChapter();
    const router = useRouter();
    const firstRunRef = useRef(true);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            banner: chapterDaft?.banner ?? "",
            name: chapterDaft?.name ?? "",
            description: chapterDaft?.description ?? "",
            isApprovalRequired: chapterDaft?.isApprovalRequired ?? false,
        },
    });

    const values = useWatch({ control: form.control });
    const handleUpsert = useDebouncedCallback(async (query: any) => {
        if (firstRunRef.current) return (firstRunRef.current = false);
        console.log({ Debounce: query });
        upsertChapter.mutate({
            name: query.name,
            description: query.description,
            isApprovalRequired: query.isApprovalRequired,
            banner: query.banner,
        });
    }, 3000);
    useEffect(() => {
        handleUpsert(values);
    }, [values]);

    function onSubmit(data: z.infer<typeof FormSchema>) {
        if (upsertChapter.isPending) return;

        const payload: TPublishChapterReq = {
            name: data.name.trim(),
        };

        console.log({ payload, data });

        publishChapter.mutate(payload, {
            onSuccess: () => {
                form.reset();

                toast.success("Publish Chapter successfully.");
            },
            onError: (error) => {
                toast.error(resError(error, `Publish Chapter failed`));
            },
        });
    }

    // tách logic upload ra ngoài và truyền vào ThumbnailUpload
    const onUpload = async (file: File) => {
        const fd = new FormData();
        fd.append("banner", file);
        // mutation phải trả về publicId (string)
        return await upsertBanner.mutateAsync(fd);
    };

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
                            <p className="text-xl font-semibold">Create New Chapter</p>
                        </div>

                        {/* <div className="flex items-center gap-2">
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
                        </div> */}
                    </div>

                    <div
                        className={cn(
                            "flex-1 p-5 overflow-y-auto grid [grid-template-columns:1fr] gap-5",
                            " lg:[grid-template-columns:0.45fr_0.65fr]"
                        )}
                    >
                        <BoxChapter>
                            {/* title */}
                            <TitleBox icon={Settings} title="Basic Information" subtitle="Setup the name and description of your chapter" />

                            {/* banner */}
                            <FormField
                                control={form.control}
                                name="banner"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold text-md">Create Chapter Image</FormLabel>

                                        <FormControl>
                                            <ImageUpload
                                                value={field.value ?? ""} // publicId hiện tại
                                                onChange={(id) => {
                                                    // ghi về form
                                                    field.onChange(id);
                                                    field.onBlur(); // mark as touched (hữu ích cho validate)
                                                }}
                                                toUrl={toUrl}
                                                onUpload={onUpload} // gọi tanstack bên ngoài
                                                isUploading={upsertBanner.isPending}
                                                onUploadError={(e) => {
                                                    // tuỳ bạn: toast.error(...)
                                                    console.error(e);
                                                }}
                                                onDelete={async () => {
                                                    // nếu cần gọi API xoá file trên server, làm ở đây
                                                    // await api.delete(publicId)
                                                }}
                                                // tuỳ chọn giao diện
                                                heightClassName="h-[300px]"
                                                className="w-full"
                                            />
                                        </FormControl>

                                        <FormDescription className="text-xs italic">
                                            This image represents your article in listings and previews. Choose one that is clear and relevant.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* name */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold text-md">Chapter Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Chapter Name" {...field} />
                                        </FormControl>
                                        <FormDescription className="text-xs italic">This name will be displayed public</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* description */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold text-md">Chapter description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Chapter description"
                                                minRows={1}
                                                maxRows={10}
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.target.value)}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs italic">This name will be displayed public</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </BoxChapter>

                        <BoxChapter>
                            {/* title */}
                            <TitleBox icon={Eye} title="Preview" subtitle="Tips for your chapter" />

                            <div className="w-full h-full border border-ring rounded-xl p-1">
                                <div className="w-full h-full relative flex items-center justify-center">
                                    {form.getValues("banner") ? (
                                        <Image
                                            src={toUrl(form.getValues("banner"))}
                                            alt="Preview"
                                            fill
                                            className="object-cover rounded-xl"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                    ) : (
                                        <ImageIcon size={50} className="text-muted-foreground" />
                                    )}
                                </div>
                            </div>

                            <div className="">
                                <p className="font-bold text-2xl">{form.getValues("name")}</p>

                                <p className="text-muted-foreground text-md">{form.getValues("description")}</p>

                                <div className="text-muted-foreground font-bold flex items-center gap-2">
                                    <Globe size={18} />
                                    <p className="text-lg ">{ChapterStatus.PUBLIC.toUpperCase()[0] + ChapterStatus.PUBLIC.toLowerCase().slice(1)}</p>
                                </div>
                            </div>
                        </BoxChapter>

                        <BoxChapter>
                            {/* title */}
                            <TitleBox icon={Settings} title="Privacy & Settings" subtitle="Settings for your chapter" />

                            {/* isApprovalRequired */}
                            <FormField
                                control={form.control}
                                name="isApprovalRequired"
                                render={({ field }) => (
                                    <FormField
                                        control={form.control}
                                        name="isApprovalRequired"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <FormLabel className="font-bold text-md">Approval Required</FormLabel>
                                                        <FormDescription className="text-xs italic">
                                                            This name will be displayed public
                                                        </FormDescription>
                                                    </div>

                                                    <FormControl>
                                                        <Switch
                                                            checked={Boolean(field.value)}
                                                            onCheckedChange={(checked) => field.onChange(checked)}
                                                            onBlur={field.onBlur}
                                                            name={field.name}
                                                            ref={field.ref}
                                                        />
                                                    </FormControl>
                                                </div>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            />
                        </BoxChapter>

                        <BoxChapter>
                            {/* title */}
                            <TitleBox icon={Zap} title="Tips" subtitle="Tips for your chapter" />

                            <ul className="list-disc pl-5">
                                <li>Keep chapter name short and memorable</li>
                                <li>Clearly describe your chapter's purpose</li>
                                <li>Use relevant tags for better discoverability</li>
                                <li>Set car rules to maintain community standards</li>
                                <li>Choose privacy settings that match your</li>
                            </ul>

                            <div className="flex w-full justify-end">
                                <div className="">
                                    <ButtonLoading loading={publishChapter.isPending} type="submit" className="w-[200px]">
                                        Publish
                                    </ButtonLoading>
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs text-muted-foreground italic">Last updated:</p>
                                        {upsertChapter.isPending ? (
                                            <Loader2 className="animate-spin w-4 h-4 text-muted-foreground" />
                                        ) : (
                                            <p className="text-xs text-muted-foreground italic">
                                                {formatLocalTime(upsertChapter.data?.updatedAt || chapterDaft?.updatedAt, "ago")}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </BoxChapter>
                    </div>
                </div>
            </form>
        </Form>
    );
}

function BoxChapter({ children, className, ...props }: { children: React.ReactNode; className?: string } & React.ComponentProps<"div">) {
    return (
        <div className={cn("p-5 flex flex-col gap-5 bg-background rounded-2xl shadow-sm", className)} {...props}>
            {children}
        </div>
    );
}
