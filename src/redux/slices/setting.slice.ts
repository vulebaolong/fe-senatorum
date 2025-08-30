import { createSlice } from "@reduxjs/toolkit";

type TInitialState = {
    loadingPage: boolean;
    openVersionUpdateDialog: boolean;
};

const initialState: TInitialState = {
    loadingPage: false,
    openVersionUpdateDialog: false,
};

const settingSlice = createSlice({
    name: "settingSlice",
    initialState,
    reducers: {
        SET_LOADING_PAGE: (state, { payload }) => {
            state.loadingPage = payload;
        },
        SET_OPEN_VERSION_UPDATE_DIALOG: (state, { payload }) => {
            state.openVersionUpdateDialog = payload;
        },
    },
});

export const { SET_LOADING_PAGE, SET_OPEN_VERSION_UPDATE_DIALOG } = settingSlice.actions;

export default settingSlice.reducer;
