import { combineReducers } from "redux";
import ga from "./ga.slice";
import setting from "./setting.slice";
import user from "./user.slice";

const combinedReducer = combineReducers({
    user,
    setting,
    ga,
});

export const rootReducer = (state: any, action: any) => {
    // RESET STORE (all slice) TO INIT
    //    if (action.type === "userSlice/RESET_USER") state = undefined;
    return combinedReducer(state, action);
};
