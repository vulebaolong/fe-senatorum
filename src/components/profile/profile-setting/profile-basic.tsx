import { useEditProfile } from "@/api/tantask/user.tanstack";
import { Textarea } from "@/components/textarea/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resError } from "@/helpers/function.helper";
import { useAppSelector } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, Save, User } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters" }).max(50, { message: "Name must be less than 50 characters" }),
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters" })
        .max(50, { message: "Username must be less than 50 characters" }),
    bio: z.string().max(100, { message: "Biography must be less than 100 characters" }),
});

export default function ProfileBasic() {
    const info = useAppSelector((state) => state.user.info);

    const editProfile = useEditProfile();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: info?.name || "",
            username: info?.username || "",
            bio: info?.bio || "",
        },
    });

    useEffect(() => {
        if (info) {
            console.log(info);
            form.reset({
                name: info.name,
                username: info.username,
                bio: info.bio,
            });
        }
    }, [info, form]);

    function onSubmit(data: z.infer<typeof FormSchema>) {
        editProfile.mutate(data, {
            onError(error) {
                if (error.message === "users with username already exists") {
                    form.setError("username", { message: "Username already exists" });
                    return;
                }

                toast.error(resError(error, `Update Profile failed`));
            },
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-500" />
                            Basic Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="h-[75px] content-start gap-1">
                                    <FormLabel className="mb-[3px] text-muted-foreground">Name</FormLabel>
                                    <FormDescription className="text-xs text-muted-foreground">(Min: 3, Max: 50)</FormDescription>
                                    <FormControl>
                                        <div className="relative">
                                            <Input placeholder="name" {...field} />
                                            <p className="absolute top-1/2 right-2 -translate-y-1/2  text-xs text-gray-500">
                                                {form.watch("name")?.length || 0}/50
                                            </p>
                                        </div>
                                    </FormControl>
                                    <FormMessage className="leading-none text-xs" />
                                </FormItem>
                            )}
                        />

                        {/* Username */}
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem className="h-[75px] content-start gap-1">
                                    <FormLabel className="mb-[3px] text-muted-foreground">Username</FormLabel>
                                    <FormDescription className="text-xs text-muted-foreground">(Min: 3, Max: 50)</FormDescription>
                                    <FormControl>
                                        <div className="relative">
                                            <div className="relative">
                                                <Input placeholder="name" {...field} className="pl-6" />
                                                <span className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-500">@</span>
                                            </div>
                                            <p className="absolute top-1/2 right-2 -translate-y-1/2  text-xs text-gray-500">
                                                {form.watch("username")?.length || 0}/50
                                            </p>
                                        </div>
                                    </FormControl>
                                    <FormMessage className="leading-none text-xs" />
                                </FormItem>
                            )}
                        />

                        {/* Bio */}
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem className="content-start gap-1">
                                    <FormLabel className="mb-[3px] text-muted-foreground">Bio</FormLabel>
                                    <FormControl>
                                         <div className="relative">
                                             <Textarea
                                                id="bio"
                                                {...field}
                                                placeholder="Tell people about yourself..."
                                                className="mt-1 min-h-[100px] pb-7"
                                                maxLength={100}
                                                maxRows={5}
                                            />
                                            <p className="absolute bottom-2 right-2 text-xs text-gray-500">
                                                {form.watch("bio")?.length || 0}/100
                                            </p>
                                        </div>
                                    </FormControl>
                                    <FormMessage className="leading-none text-xs" />
                                </FormItem>
                            )}
                        />

                        <Button
                            disabled={editProfile.isPending || !form.formState.isDirty}
                            type="submit"
                            variant="outline"
                            size={"sm"}
                            className="w-[80px]"
                        >
                            {editProfile.isPending ? <Loader2Icon className="animate-spin" /> : <Save />}
                            Save
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}
