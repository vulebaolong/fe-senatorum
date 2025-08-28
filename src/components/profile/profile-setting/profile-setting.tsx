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
import { ROUTER_CLIENT } from "@/constant/router.constant";
import { formatLocalTime, resError, toUrl } from "@/helpers/function.helper";
import { cn } from "@/lib/utils";
import { TResAction } from "@/types/app.type";
import { TArticle, TPublishArticleReq } from "@/types/article.type";
import { TCategory } from "@/types/category.type";
import { TType } from "@/types/type.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebouncedCallback } from "@mantine/hooks";
import { $createParagraphNode, $getRoot, LexicalEditor } from "lexical";
import { ArrowLeft, Camera, Eye, Globe, Loader2, Mail, Save, Settings, Tag, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Editor from "../../lexical/editor";
import { useAppSelector } from "@/redux/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

export default function ProfileSetting() {
    const info = useAppSelector((state) => state.user.info);
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
        defaultValues: {},
    });

    const values = useWatch({ control: form.control });
    const handleUpsert = useDebouncedCallback(async (query: any) => {}, {
        delay: 1000,
        leading: false,
        flushOnUnmount: true,
    });
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
                    root.append($createParagraphNode());
                });

                toast.success("Publish Article successfully.");
            },
            onError: (error) => {
                toast.error(resError(error, `Publish Article failed`));
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
                                    if (info) router.push(`/${info.username}`);
                                }}
                                variant="link"
                                size={"sm"}
                                className="text-muted-foreground"
                            >
                                <ArrowLeft />
                                Back to Profile
                            </Button>
                            <Separator orientation="vertical" className="!h-[20px]" />
                            <p className="text-lg font-semibold">Edit Profile</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button type="button" onClick={() => {}} variant="outline" size={"sm"}>
                                <Save />
                                Save
                            </Button>
                        </div>
                    </div>

                    {/* body */}
                    <div className="flex flex-col gap-10 flex-1 p-5 overflow-y-auto">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Camera className="w-5 h-5 text-blue-500" />
                                    Profile Images
                                </CardTitle>
                                <CardDescription>Upload your profile picture and cover photo</CardDescription>
                            </CardHeader>
                        </Card>

                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5 text-blue-500" />
                                    Basic Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Display Name */}
                                <div>
                                    <Label htmlFor="displayName">Display Name</Label>
                                    <Input
                                        id="displayName"
                                        // value={profileData.displayName}
                                        // onChange={(e) => handleInputChange("displayName", e.target.value)}
                                        placeholder="Your display name"
                                        className="mt-1"
                                        maxLength={50}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">This is how your name will appear to other users</p>
                                </div>

                                {/* Username */}
                                <div>
                                    <Label htmlFor="username">Username</Label>
                                    <div className="mt-1 relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">@</span>
                                        <Input
                                            id="username"
                                            // value={profileData.username}
                                            // onChange={(e) => handleInputChange("username", e.target.value)}
                                            placeholder="username"
                                            className="pl-8"
                                            maxLength={30}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Your unique username for mentions and profile URL</p>
                                </div>

                                {/* Bio */}
                                <div>
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        // value={profileData.bio}
                                        // onChange={(e) => handleInputChange("bio", e.target.value)}
                                        placeholder="Tell people about yourself..."
                                        className="mt-1 min-h-[100px]"
                                        maxLength={500}
                                    />
                                    {/* <p className="text-xs text-gray-500 mt-1">{profileData.bio.length}/500 characters</p> */}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="w-5 h-5 text-green-500" />
                                    Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Email */}
                                <div>
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="mt-1 flex gap-2">
                                        <Input
                                            id="email"
                                            type="email"
                                            // value={profileData.email}
                                            // onChange={(e) => handleInputChange("email", e.target.value)}
                                            placeholder="your@email.com"
                                            className="flex-1"
                                        />
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            // onClick={() => handlePrivacyChange("showEmail", !privacySettings.showEmail)}
                                            className="gap-1"
                                        >
                                            {/* {privacySettings.showEmail ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />} */}
                                        </Button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {/* {privacySettings.showEmail ? "Visible to other users" : "Private, not visible to other users"} */}
                                        Private, not visible to other users
                                    </p>
                                </div>

                                {/* Phone */}
                                <div>
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <div className="mt-1 flex gap-2">
                                        <Input
                                            id="phone"
                                            // value={profileData.phone}
                                            // onChange={(e) => handleInputChange("phone", e.target.value)}
                                            placeholder="+1 (555) 123-4567"
                                            className="flex-1"
                                        />
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            // onClick={() => handlePrivacyChange("showPhone", !privacySettings.showPhone)}
                                            className="gap-1"
                                        >
                                            {/* {privacySettings.showPhone ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />} */}
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {/* {privacySettings.showPhone ? "Visible to other users" : "Private, not visible to other users"} */}
                                        Private, not visible to other users
                                    </p>
                                </div>

                                {/* Website */}
                                <div>
                                    <Label htmlFor="website">Website</Label>
                                    <div className="mt-1 relative">
                                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            id="website"
                                            // value={profileData.website}
                                            // onChange={(e) => handleInputChange("website", e.target.value)}
                                            placeholder="https://yourwebsite.com"
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </Form>
    );
}
