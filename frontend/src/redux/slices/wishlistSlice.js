
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  loading: false,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,

  reducers: {
    setWishlist: (state, action) => {
      state.products = action.payload || [];
      state.loading = false;
    },

    addWishlistProduct: (state, action) => {
      const product = action.payload;

      const exists = state.products.some(
        (item) => item._id === product._id
      );

      if (!exists) {
        state.products.push(product);
      }
    },

    removeWishlistProduct: (state, action) => {
      state.products = state.products.filter(
        (product) =>
          product._id !== action.payload
      );
    },

    clearWishlist: (state) => {
      state.products = [];
    },

    setWishlistLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setWishlist,
  addWishlistProduct,
  removeWishlistProduct,
  clearWishlist,
  setWishlistLoading,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
