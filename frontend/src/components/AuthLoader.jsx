import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import api from "../services/api";
import {
  loginSuccess,
  logout,
} from "../redux/slices/authSlice";

function AuthLoader() {
  const dispatch = useDispatch();

  const { token, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    const loadProfile = async () => {
      if (!token || !isAuthenticated) {
        return;
      }

      try {
        const response = await api.get("/users/profile");
        const user = response.data.user;

        if (!user) {
          return;
        }

        dispatch(
          loginSuccess({
            user: {
              ...user,
              role: user.role?.toLowerCase(),
            },
            token,
          })
        );
      } catch (error) {
        console.error("AUTH PROFILE LOAD ERROR:", error);

        if (error.response?.status === 401) {
          dispatch(logout());
        }
      }
    };

    loadProfile();
  }, [dispatch, token, isAuthenticated]);

  return null;
}

export default AuthLoader;
