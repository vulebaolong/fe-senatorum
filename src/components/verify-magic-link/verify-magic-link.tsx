"use client";

import { useVerifyMagicLink } from "@/api/tantask/auth.tanstack";
import { ROUTER_CLIENT } from "@/constant/router.constant";
import { resError } from "@/helpers/function.helper";
import useRouter from "@/hooks/use-router-custom";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function VerifyMagicLink() {
    const { id } = useParams<{ id: string }>();
    const verifyMagicLink = useVerifyMagicLink();
    const router = useRouter();
    useEffect(() => {
        if (!id) return;
        verifyMagicLink.mutate(
            { magicLinkId: id },
            {
                onSuccess: () => {
                    router.push(ROUTER_CLIENT.HOME);
                },
                onError: (err) => {
                    toast.error(resError(err, `Verify magic link failed`));
                    router.push(ROUTER_CLIENT.LOGIN);
                },
            }
        );
    }, [id]);
    return <></>;
}
