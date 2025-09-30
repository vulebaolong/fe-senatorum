import { TArticle } from "@/types/article.type";
import { createSlice } from "@reduxjs/toolkit";
import { number } from "zod";

type TInitialState = {
    articleNew: TArticle | null;
    offsetNew: number;
};

const initialState: TInitialState = {
    articleNew: null,
    offsetNew: 0,
};

const articleSlice = createSlice({
    name: "articleSlice",
    initialState,
    reducers: {
        SET_ARTICLE_NEW: (state, { payload }) => {
            state.articleNew = payload;
        },
        SET_OFFSET_NEW: (state) => {
            state.offsetNew = state.offsetNew + 1;
        },
    },
});

export const { SET_ARTICLE_NEW, SET_OFFSET_NEW } = articleSlice.actions;

export default articleSlice.reducer;
