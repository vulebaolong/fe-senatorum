import { useMutation, useQuery } from "@tanstack/react-query";
import { countUnreadNotificationAction, getAllNotificationAction, readNotificationAction } from "../actions/notification.action";
import { TNotification } from "@/types/notification.type";

export const useGetAllNotification = (payload: any) => {
    return useQuery({
        queryKey: ["get-all-notification", payload],
        queryFn: async () => {
            const { pagination, filters, sort } = payload;
            const { page, pageSize } = pagination;
            const query = `page=${page}&pageSize=${pageSize}&filters=${JSON.stringify(filters)}&sortBy=${sort?.sortBy}&isDesc=${sort?.isDesc}`;

            const { data, status, message } = await getAllNotificationAction(query);
            if (status === "error" || data === null) throw new Error(message);

            // await wait(5000);
            console.log({ useGetAllNotification: data });
            return data;
        },
    });
};

export const useCountUnreadNotification = () => {
    return useQuery({
        queryKey: ["count-unread-notification"],
        queryFn: async () => {
            const { data, status, message } = await countUnreadNotificationAction();
            if (status === "error" || data === null) throw new Error(message);

            // await wait(5000);
            console.log({ useCountUnreadNotification: data });
            return data;
        },
    });
};

export const useReadNotification = () => {
    return useMutation({
        mutationFn: async (notificationId: TNotification["id"]) => {
            const { data, status, message } = await readNotificationAction(notificationId);
            if (status === "error" || data === null) throw new Error(message);
            console.log({ useCreateComment: data });
            return data;
        },
    });
};
