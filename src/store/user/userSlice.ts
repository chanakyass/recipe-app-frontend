import { SliceCaseReducers, createSlice } from "@reduxjs/toolkit";
import { User, UserState } from "../store.model";

const userSlice = createSlice<UserState, SliceCaseReducers<UserState>, string>({
    name: 'users',
    initialState: {
      loggedInUser: {} as User,
      loading: false,
    },
    reducers: {
        userAdded(state, action) {
            const { payload: user } = action as { payload: User, type: string };
            state.loggedInUser = user
        },
        userModified(state, action) {
            const { payload: modifiedUser } = action as { payload: User, type: string };
            Object.assign(state.loggedInUser, modifiedUser);
        },
        setUserLoading(state, action) {
            const { payload: loading } = action;
            state.loading = loading;
        }
    },
});

export const { userAdded, userModified, setUserLoading } = userSlice.actions;

 export default userSlice.reducer;