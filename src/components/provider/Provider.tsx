"use client";
import "../../styles/animation.css";
import "../../styles/global.css";
import "../../styles/editor.css";


import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { ReactNode } from "react";
import ProviderRedux from "./redux/ProviderRedux";
import SocketProvider from "./socket/SocketProvider";
import { Toaster } from "@/components/ui/sonner";
import ShadcnProvider from "./shadcn/shadcn-provider";

dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false,
            gcTime: 0,
            staleTime: 0,
        },
    },
});

export default function Provider({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <ShadcnProvider>
                <ProviderRedux>
                    <SocketProvider>
                        {children}
                        <Toaster />
                    </SocketProvider>
                </ProviderRedux>
            </ShadcnProvider>
        </QueryClientProvider>
    );
}
