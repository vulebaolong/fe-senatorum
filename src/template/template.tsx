"use client";

import { logout } from "@/api/core.api";
import { useGetInfoMutation } from "@/api/tantask/auth.tanstack";
import { useGetVersion } from "@/api/tantask/setting-system.tanstack";
import { VersionUpdateDialog } from "@/components/version-update-dialog/version-update-dialog";
import { SET_INFO } from "@/redux/slices/user.slice";
import { useAppDispatch } from "@/redux/store";
import { useEffect, useState } from "react";

type TProps = {
    children: React.ReactNode;
};

export default function Template({ children }: TProps) {
    const getInfo = useGetInfoMutation();
    const getVersion = useGetVersion();
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
            {getVersion.data?.version && <VersionUpdateDialog latest={getVersion.data?.version} />}
        </>
    );
}
