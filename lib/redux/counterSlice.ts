import { createSlice,PayloadAction, } from "@reduxjs/toolkit";
import { User } from "firebase/auth";
import type { RootState } from './store'


// Define a type for the slice state
interface UserState {
    user: User
  }
  
  // Define the initial state using that type
  const initialState: UserState = {
    user: null
  }

export const userSlice = createSlice({
    name: "userInfo",
    initialState,
    reducers: {
        isUserLoggedIn: (state, action:PayloadAction<User>) => {
            state.user = action.payload;
        },
    },
    
})

export const { isUserLoggedIn } = userSlice.actions;

export const selectCount = (state: RootState) => state.userInfo.user;
export default userSlice.reducer;
