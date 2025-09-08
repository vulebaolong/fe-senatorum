import { NEXT_PUBLIC_IS_PRODUCTION } from "@/constant/app.constant";
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import { rootReducer } from "./slices/rootReducer";

export const store = configureStore({
    reducer: rootReducer, // ⛔️ Không kết nối Redux DevTools ở production
    devTools: !NEXT_PUBLIC_IS_PRODUCTION,
});

export type AppStore = typeof store;
export type AppDispatch = AppStore["dispatch"];
export type RootState = ReturnType<AppStore["getState"]>;

// Hooks đã gán kiểu sẵn
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
