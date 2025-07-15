import VerifyMagicLink from "@/components/verify-magic-link/verify-magic-link";
import { ROUTER_CLIENT } from "@/constant/router.constant";
import { TVerifyMagicLinkReq } from "@/types/auth.type";
import { redirect } from "next/navigation";

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const params = await searchParams;

    const token = typeof params.token === "string" ? params.token : Array.isArray(params.token) ? params.token[0] : undefined;
    const nonce = typeof params.nonce === "string" ? params.nonce : Array.isArray(params.nonce) ? params.nonce[0] : undefined;

    if (!token || !nonce) {
        redirect(ROUTER_CLIENT.LOGIN);
    }

    // Đảm bảo đúng type cho BE
    const payload: TVerifyMagicLinkReq = { token, nonce };

    return <VerifyMagicLink params={payload} />;
}
