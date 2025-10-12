import { TArticle } from "@/types/article.type";
import { createSlice } from "@reduxjs/toolkit";

type TInitialState = {
    articleNew: TArticle | null;
    postSlugUpdate: string | null;
};

const initialState: TInitialState = {
    articleNew: null,
    postSlugUpdate: null,
};

const articleSlice = createSlice({
    name: "articleSlice",
    initialState,
    reducers: {
        SET_ARTICLE_NEW: (state, { payload }) => {
            state.articleNew = payload;
        },
    
        SET_POST_SLUG_UPDATE: (state, { payload }) => {
            state.postSlugUpdate = payload;
        },
    },
});

export const { SET_ARTICLE_NEW, SET_POST_SLUG_UPDATE } = articleSlice.actions;

export default articleSlice.reducer;
