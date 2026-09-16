import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    setCart: (state, action) => {
      state.items = action.payload?.items || [];
    },

    clearCart: (state) => {
      state.items = [];
    },

    removeCartItem: (state, action) => {
      state.items = state.items.filter(
        (item) =>
          item?.product?._id !== action.payload
      );
    },

    updateCartItem: (state, action) => {
      const { productId, quantity } =
        action.payload;

      const item = state.items.find(
        (item) =>
          item?.product?._id === productId
      );

      if (item) {
        item.quantity = quantity;
      }
    },
  },
});

export const {
  setCart,
  clearCart,
  removeCartItem,
  updateCartItem,
} = cartSlice.actions;

export default cartSlice.reducer;