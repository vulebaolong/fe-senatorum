import { useLoginGooleOneTap } from "@/api/tantask/auth.tanstack";
import { ROUTER_CLIENT } from "@/constant/router.constant";
import { resError } from "@/helpers/function.helper";
import { useGoogleOneTapLogin } from "@/hooks/google-tap-login.hook";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

export default function LoginGoogleOneTap() {
    const router = useRouter();
    const loginGooleOneTap = useLoginGooleOneTap();
    const { response, disableAutoSelect } = useGoogleOneTapLogin({ delayShowPopup: 1000 });

    useEffect(() => {
        if (response) {
            loginGooleOneTap.mutate(
                { credential: response.credential },
                {
                    onSuccess: () => {
                        disableAutoSelect();
                        router.push(ROUTER_CLIENT.HOME);
                    },
                    onError: (error) => {
                        toast.error(resError(error, `Login failed`));
                    },
                }
            );
        }
    }, [response]);

    return <></>;
}
