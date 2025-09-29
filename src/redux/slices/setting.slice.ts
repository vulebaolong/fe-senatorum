import { createSlice } from "@reduxjs/toolkit";

type TInitialState = {
    loadingPage: boolean;
    openVersionUpdateDialog: boolean;
    openCreatePostDialog: boolean;
};

const initialState: TInitialState = {
    loadingPage: false,
    openVersionUpdateDialog: false,
    openCreatePostDialog: false,
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
        SET_OPEN_CREATE_POST_DIALOG: (state, { payload }) => {
            state.openCreatePostDialog = payload;
        },
    },
});

export const { SET_LOADING_PAGE, SET_OPEN_VERSION_UPDATE_DIALOG, SET_OPEN_CREATE_POST_DIALOG } = settingSlice.actions;

export default settingSlice.reducer;
