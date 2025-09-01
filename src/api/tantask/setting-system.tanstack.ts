import { VERSION } from "@/constant/app.constant";
import { useAppDispatch } from "@/redux/store";
import { SET_OPEN_VERSION_UPDATE_DIALOG } from "@/redux/slices/setting.slice";
import { useQuery } from "@tanstack/react-query";
import { getVersion } from "../actions/setting-system.action";

export const useGetVersion = () => {
    const dispatch = useAppDispatch();
    return useQuery({
        queryKey: ["get-version"],
        queryFn: async () => {
            const { data, status, message } = await getVersion();
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useGetVersion: data });
            if (data.version !== VERSION) {
                dispatch(SET_OPEN_VERSION_UPDATE_DIALOG(true));
            }
            return data;
        },
    });
};
