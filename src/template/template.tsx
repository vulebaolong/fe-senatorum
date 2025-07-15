"use client";

import useRouter from "@/hooks/use-router-custom";
import { useAppSelector } from "@/redux/hooks";
import { useGetInfoMutation } from "@/api/tantask/auth.tanstack";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

type TProps = {
    children: React.ReactNode;
    protect?: boolean;
};

export default function Template({ children, protect = false }: TProps) {
    const router = useRouter();
    const getInfo = useGetInfoMutation();
    const [allowRender, setAllowRender] = useState(!protect);
    const loadingPage = useAppSelector((state) => state.setting.loadingPage);

    useEffect(() => {
        getInfo.mutate(undefined, {
            onSuccess: () => {
                setAllowRender(true);
            },
            onError: () => {
                if (protect) {
                    setAllowRender(false);
                    router.push("/login");
                }
            },
        });
    }, []);

    return (
        <>
            {allowRender && children}
            <div
                style={{
                    position: "fixed",
                    zIndex: 99999,
                    visibility: loadingPage || getInfo.isPending || !allowRender ? "visible" : "hidden",
                    bottom: "20px",
                    left: "20px",
                }}
                className="flex items-center justify-center"
            >
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            </div>
        </>
    );
}
