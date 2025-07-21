import { CredentialResponse } from "google-one-tap";
import { useCallback, useEffect, useRef, useState } from "react";

type HistoryEntry = {
    message: string;
    timestamp: Date;
};

type TUseGoogleOneTapLogin = {
    isLogin?: boolean;
    delayShowPopup?: number;
};

export const useGoogleOneTapLogin = (option?: TUseGoogleOneTapLogin) => {
    const { isLogin = false, delayShowPopup = 0 } = option || {};
    const [response, setResponse] = useState<CredentialResponse | null>(null);
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const googleRef = useRef<typeof window.google>(null);

    const oneTap = useCallback(() => {
        const { google } = window;
        if (!google || !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) return;

        googleRef.current = google;

        google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            callback: (res) => setResponse(res),
        });

        google.accounts.id.prompt((notification) => {
            let msg = "";

            if (notification.isNotDisplayed()) {
                msg = `getNotDisplayedReason: ${notification.getNotDisplayedReason()}`;
            } else if (notification.isSkippedMoment()) {
                msg = `getSkippedReason: ${notification.getSkippedReason()}`;
            } else if (notification.isDismissedMoment()) {
                msg = `getDismissedReason: ${notification.getDismissedReason()}`;
            }

            if (msg) {
                setHistory((prev) => [...prev, { message: msg, timestamp: new Date() }]);
            }
        });
    }, []);

    useEffect(() => {
        if (isLogin) return;
        const timeout = setTimeout(() => oneTap(), delayShowPopup);
        return () => clearTimeout(timeout);
    }, [oneTap, isLogin]);

    const disableAutoSelect = () => {
        if (googleRef.current) {
            googleRef.current?.accounts.id.disableAutoSelect();
        } else {
            console.log("googleRef.current is null");
        }
    };

    return {
        response,
        history,
        disableAutoSelect,
        google: googleRef.current,
    };
};
