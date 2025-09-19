"use client";

import { useLoginMagicLink } from "@/api/tantask/auth.tanstack";
import { Input } from "@/components/ui/input";
import { TITLE } from "@/constant/app.constant";
import { ROUTER_CLIENT } from "@/constant/router.constant";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Coffee, Link, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Logo } from "../logo/Logo";
import { ButtonLoading } from "../ui/button-loading";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import LoginGoogleButton from "./login-google-button";
import LoginGoogleOneTap from "./login-google-one-tap";

const FormSchema = z.object({
    email: z.email({ message: "Email không hợp lệ" }),
});

export function LoginMagicLink({ className, ...props }: React.ComponentProps<"div">) {
    const loginMagicLink = useLoginMagicLink();
    const router = useRouter();

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
                toast.success("We've emailed you a sign-in link.", {
                    id: "magic-link-sent",
                    description: (
                        <div className="space-y-1">
                            <p>If you don't receive an email, check your spam folder.</p>
                            <p className="text-xs italic opacity-70">The link expires in 2 minutes.</p>
                        </div>
                    ),
                    duration: Infinity,
                    action: {
                        label: "Dismiss",
                        onClick: () => {},
                    },
                });
            },
        });
    }

    return (
        <>
            {/* Container hòa hợp với hình nền */}
            <div className="relative z-10 w-full max-w-sm">
                <div className="relative p-6 rounded-3xl bg-black/10 border border-white/20 shadow-lg">
                    {/* Lớp gradient nhẹ để tăng độ tương phản cho text */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-black/10 rounded-xl pointer-events-none" />

                    <div className={cn("relative flex flex-col gap-6", className)} {...props}>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center gap-5">
                                <a href="#" className="flex flex-col items-center gap-5 font-medium">
                                    <Logo className="w-[60px] h-[60px]" />
                                    <span className="sr-only">{TITLE}</span>
                                </a>
                                <div className="text-center space-y-1">
                                    <h1 className="text-[42px] leading-none font-light tracking-wide text-white">
                                        <span className="font-bold">{TITLE}</span>
                                    </h1>
                                    <p className="text-white/90 flex items-center justify-center gap-2 text-lg tracking-wider font-medium">
                                        <Coffee className="size-4" />A place to gather!
                                    </p>
                                </div>
                            </div>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <div className="grid gap-2">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem className="dark h-[75px] content-start gap-1">
                                                    <FormLabel className="text-white mb-[3px] gap-1">
                                                        <Mail className="size-3.5" />
                                                        Email
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input className="dark text-white placeholder:text-white/80" placeholder="Email" {...field} />
                                                    </FormControl>
                                                    <FormMessage className="leading-none text-xs" />
                                                </FormItem>
                                            )}
                                        />

                                        <ButtonLoading loading={loginMagicLink.isPending} type="submit" className="dark">
                                            <Link className="size-3.5" />
                                            Send Link
                                        </ButtonLoading>
                                    </div>
                                </form>
                            </Form>
                            <div className="dark flex items-center opacity-70">
                                <div className="bg-white h-[0.5px] flex-1 "></div>
                                <span className="relative z-10 px-2 text-white">Or</span>
                                <div className="bg-white h-[0.5px] flex-1 "></div>
                            </div>
                            <div className="light">
                                <LoginGoogleButton className="light text-black/60 !bg-white/90 hover:!bg-white/80 hover:!text-black/80" />
                            </div>
                        </div>
                        <div className="text-white/80 *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                            By clicking continue, you agree to our{" "}
                            <p
                                className="inline-block hover:underline cursor-pointer"
                                onClick={() => {
                                    router.push(ROUTER_CLIENT.POLYCY.TERM);
                                }}
                            >
                                Terms of Service
                            </p>{" "}
                            and{" "}
                            <p
                                className="inline-block hover:underline cursor-pointer"
                                onClick={() => {
                                    router.push(ROUTER_CLIENT.POLYCY.POLICY);
                                }}
                            >
                                Privacy Policy
                            </p>
                            .
                        </div>
                    </div>
                </div>
            </div>
            <LoginGoogleOneTap />
        </>
    );
}
