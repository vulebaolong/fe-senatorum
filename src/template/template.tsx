"use client";

import { logout } from "@/api/core.api";
import { useGetInfoMutation } from "@/api/tantask/auth.tanstack";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { SET_INFO } from "@/redux/slices/user.slice";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type TProps = {
    children: React.ReactNode;
};

export default function Template({ children }: TProps) {
    const getInfo = useGetInfoMutation();
    const [allowRender, setAllowRender] = useState(false);
    // const loadingPage = useAppSelector((state) => state.setting.loadingPage);
    const dispatch = useAppDispatch();

    useEffect(() => {
        getInfo.mutate(undefined, {
            onSuccess: (data) => {
                setAllowRender(true);
                dispatch(SET_INFO(data));
            },
            onError: () => {
                setAllowRender(false);
                logout();
            },
        });
    }, []);

    return (
        <>
            {allowRender && children}
            {/* <div
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
            </div> */}
        </>
    );
}
