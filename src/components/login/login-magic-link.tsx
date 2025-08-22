"use client";

import { GalleryVerticalEnd } from "lucide-react";

import { useLoginMagicLink } from "@/api/tantask/auth.tanstack";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import ThemeToggleV2 from "../theme-toggle/theme-toggle-v2";
import { ButtonLoading } from "../ui/button-loading";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import LoginAppleButton from "./login-apple-button";
import LoginGoogleButton from "./login-google-button";
import LoginGoogleOneTap from "./login-google-one-tap";

const FormSchema = z.object({
    email: z.email({ message: "Email không hợp lệ" }),
});

export function LoginMagicLink({ className, ...props }: React.ComponentProps<"div">) {
    const loginMagicLink = useLoginMagicLink();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: ``,
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        const payload = {
            email: data.email.trim(),
        };
        loginMagicLink.mutate(payload, {
            onSuccess: () => {
                toast.success("Vui lòng kiểm tra email để đăng nhập", {
                    duration: Infinity,
                    action: {
                        label: "Đã hiểu",
                        onClick: () => {
                            /* custom action nếu muốn */
                        },
                    },
                });
            },
        });
    }

    return (
        <>
            <div className={cn("flex flex-col gap-6", className)} {...props}>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <a href="#" className="flex flex-col items-center gap-2 font-medium">
                            <div className="flex size-8 items-center justify-center rounded-md">
                                <GalleryVerticalEnd className="size-6" />
                            </div>
                            <span className="sr-only">Acme Inc.</span>
                        </a>
                        <h1 className="text-xl font-bold">Welcome to Acme Inc.</h1>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="h-[75px] content-start gap-1">
                                            <FormLabel className="mb-[3px]">Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Email" {...field} />
                                            </FormControl>
                                            <FormMessage className="leading-none text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <ButtonLoading loading={loginMagicLink.isPending} type="submit" className="w-full">
                                    Send Link
                                </ButtonLoading>
                            </div>
                        </form>
                    </Form>
                    <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                        <span className="text-muted-foreground relative z-10 px-2">Or</span>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <LoginAppleButton />
                        <LoginGoogleButton />
                    </div>

                    <div className="flex items-center justify-center">
                        <ThemeToggleV2 />
                    </div>
                </div>
                <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                    By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
                </div>
            </div>
            <LoginGoogleOneTap />
        </>
    );
}
