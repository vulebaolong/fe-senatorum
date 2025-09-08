import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import { rootReducer } from "./slices/rootReducer";
import { NEXT_PUBLIC_IS_PRODUCTION } from "@/constant/app.constant";

export const store = configureStore({
    reducer: rootReducer, // ⛔️ Không kết nối Redux DevTools ở production
    devTools: !NEXT_PUBLIC_IS_PRODUCTION,
    // Chỉ bật middleware debug ở dev
    middleware: (getDefaultMiddleware) => {
        const mdw = getDefaultMiddleware({
            // 2 check này RTK mặc định tắt ở prod, để rõ ràng ta giữ nguyên:
            serializableCheck: !NEXT_PUBLIC_IS_PRODUCTION,
            immutableCheck: !NEXT_PUBLIC_IS_PRODUCTION,
        });

        if (!NEXT_PUBLIC_IS_PRODUCTION) {
            // optional: logger chỉ chạy ở dev
            const { createLogger } = require("redux-logger");
            mdw.push(createLogger({ collapsed: true }));
        }
        return mdw;
    },
});

export type AppStore = typeof store;
export type AppDispatch = AppStore["dispatch"];
export type RootState = ReturnType<AppStore["getState"]>;

// Hooks đã gán kiểu sẵn
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
