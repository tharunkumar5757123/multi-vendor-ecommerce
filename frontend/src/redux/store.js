
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import wishlistReducer from "./slices/wishlistSlice";
import cartReducer from "./slices/cartSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    wishlist: wishlistReducer,
   cart: cartReducer,
  },
});

export default store;
