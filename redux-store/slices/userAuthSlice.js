import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null
};
const userAuthSlice = createSlice({
    name: "userAuthState",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setUserNull: (state) => {
            state.user = null
        }
    }
});

export const { setUser, setUserNull } = userAuthSlice.actions;
export default userAuthSlice.reducer;
export const selectUser = (state) => state.user.user;