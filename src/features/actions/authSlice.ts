import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types/user";

interface ActionsState {
  user: User | null;
  alert: {
    title: string;
    message: string;
    showAlert: boolean;
  };
  mode: string;
}

const initialState: ActionsState = {
  user: null,
  alert: { title: "", message: "", showAlert: false },
  mode: "login",
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    alert: (
      state,
      action: PayloadAction<{ title: string; message: string }>,
    ) => {
      state.alert.title = action.payload.title;
      state.alert.message = action.payload.message;
      state.alert.showAlert = true;
    },
    closeAlert: (state) => {
      state.alert.showAlert = false;
    },
    loginUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logoutUser: (state) => {
      localStorage.removeItem("token");
      state.user = null;
      state.mode = "login";
    },
    switchMode: (state) => {
      state.mode = state.mode === "login" ? "signup" : "login";
    },
  },
});

export const { loginUser, logoutUser, alert, closeAlert, switchMode } =
  authSlice.actions;
export default authSlice.reducer;
