import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");
const getValidToken = (token) =>
  token && token !== "undefined" && token !== "null"
    ? token
    : null;

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: getValidToken(storedToken),
  isAuthenticated: !!getValidToken(storedToken),
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    loginSuccess: (state, action) => {
      const { user, token } = action.payload;
      const nextToken =
        getValidToken(token) ||
        getValidToken(state.token) ||
        getValidToken(localStorage.getItem("token"));

      state.user = user;
      state.token = nextToken;
      state.isAuthenticated = !!nextToken;

      localStorage.setItem("user", JSON.stringify(user));

      if (nextToken) {
        localStorage.setItem("token", nextToken);
      }
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;
