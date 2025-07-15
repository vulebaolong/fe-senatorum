"use client";

import { useLoginForm } from "@/api/tantask/auth.tanstack";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ROUTER_CLIENT } from "@/constant/router.constant";
import useRouter from "@/hooks/use-router-custom";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ThemeToggleV1 } from "../theme-toggle/theme-toggle-v1";
import { ButtonLoading } from "../ui/button-loading";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { PasswordInput } from "../ui/password-input";

export const validatePassword = [
    { re: /[0-9]/, label: "Includes number." },
    { re: /[a-z]/, label: "Includes lowercase letter." },
    { re: /[A-Z]/, label: "Includes uppercase letter." },
    { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol." },
    { re: /^.{6,}$/, label: "Includes at least 6 characters." },
];

const FormSchema = z.object({
    email: z.email({ message: "Email không hợp lệ" }),
    password: z
        .string()
        .regex(validatePassword[0].re, { message: validatePassword[0].label })
        .regex(validatePassword[1].re, { message: validatePassword[1].label })
        .regex(validatePassword[2].re, { message: validatePassword[2].label })
        .regex(validatePassword[3].re, { message: validatePassword[3].label })
        .regex(validatePassword[4].re, { message: validatePassword[4].label }),
});

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
    const useloginForm = useLoginForm();
    const router = useRouter();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: `example@gmail.com`,
            password: `Example@123`,
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        const payload = {
            email: data.email.trim(),
            password: data.password.trim(),
        };
        useloginForm.mutate(payload, {
            onSuccess: (data) => {
                console.log({ data });
                if (data.isTotp) {
                    // setStep(`login-google-authentication`);
                } else {
                    router.push(ROUTER_CLIENT.HOME);
                    toast.success(`Login successfully`);
                }
            },
        });
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>Login with your Apple or Google account</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <div className="flex flex-col gap-4">
                            <Button variant="outline" className="w-full">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path
                                        d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                                        fill="currentColor"
                                    />
                                </svg>
                                Login with Apple
                            </Button>
                            <Button variant="outline" className="w-full">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path
                                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                        fill="currentColor"
                                    />
                                </svg>
                                Login with Google
                            </Button>
                        </div>
                        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                            <span className="bg-card text-muted-foreground relative z-10 px-2">Or continue with</span>
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
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem className="h-[75px] content-start gap-1">
                                                <div className="flex items-center">
                                                    <FormLabel className="mb-[3px]">Password</FormLabel>
                                                    <a
                                                        tabIndex={-1}
                                                        href="#"
                                                        className="ml-auto text-sm leading-none underline-offset-4 hover:underline"
                                                    >
                                                        Forgot your password?
                                                    </a>
                                                </div>
                                                <FormControl>
                                                    <PasswordInput placeholder="Password" {...field} />
                                                </FormControl>
                                                <FormMessage className="leading-none text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                    <ButtonLoading loading={useloginForm.isPending} type="submit" className="w-full">
                                        Login
                                    </ButtonLoading>
                                </div>
                            </form>
                        </Form>

                        <div className="text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <a href="#" className="underline underline-offset-4">
                                Sign up
                            </a>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div className="flex items-center justify-center">
                <ThemeToggleV1 />
            </div>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </div>
        </div>
    );
}
