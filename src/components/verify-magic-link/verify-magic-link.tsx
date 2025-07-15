"use client";

import { useVerifyMagicLink } from "@/api/tantask/auth.tanstack";
import { ROUTER_CLIENT } from "@/constant/router.constant";
import useRouter from "@/hooks/use-router-custom";
import { TVerifyMagicLinkReq } from "@/types/auth.type";
import { useEffect } from "react";

type TProps = {
    params: TVerifyMagicLinkReq;
};

export default function VerifyMagicLink({ params }: TProps) {
    const verifyMagicLink = useVerifyMagicLink();
    const router = useRouter();
    useEffect(() => {
        if (!params) return;
        verifyMagicLink.mutate(params, {
            onSuccess: () => {
                router.push(ROUTER_CLIENT.HOME);
            },
            onError: () => {
                router.push(ROUTER_CLIENT.LOGIN);
            },
        });
    }, [params]);

    return <></>;
}
