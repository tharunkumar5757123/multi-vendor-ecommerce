
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import api from "../services/api";

import {
  setWishlist,
  setWishlistLoading,
} from "../redux/slices/wishlistSlice";

function WishlistLoader() {
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    const loadWishlist = async () => {
      // Only customers need wishlist data
      if (
        !isAuthenticated ||
        user?.role !== "customer"
      ) {
        dispatch(setWishlist([]));
        dispatch(setWishlistLoading(false));
        return;
      }

      try {
        dispatch(setWishlistLoading(true));

        const response = await api.get("/wishlist");

        // Backend response:
        // {
        //   message: "Wishlist fetched successfully",
        //   wishlist: [...]
        // }
        const wishlistProducts =
          response.data.wishlist || [];

        dispatch(setWishlist(wishlistProducts));
      } catch (error) {
        console.error(
          "LOAD WISHLIST ERROR:",
          error
        );

        dispatch(setWishlist([]));
      } finally {
        dispatch(setWishlistLoading(false));
      }
    };

    loadWishlist();
  }, [
    isAuthenticated,
    user?.role,
    dispatch,
  ]);

  return null;
}

export default WishlistLoader;
