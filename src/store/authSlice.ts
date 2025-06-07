import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CustomUser {
  photoURL: string | undefined;
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AuthState {
  user: CustomUser | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<CustomUser | null>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
