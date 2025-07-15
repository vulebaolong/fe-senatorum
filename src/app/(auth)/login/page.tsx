import { LoginMagicLink } from "@/components/login/login-magic-link";

export default function page() {
    return (
        <div className="flex w-full max-w-sm flex-col gap-6">
            <LoginMagicLink />
        </div>
    );
}
