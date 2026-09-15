
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import api from "../services/api";

import {
  setWishlist,
  setWishlistLoading,
} from "../redux/slices/wishlistSlice";

function WishlistLoader() {
  const dispatch = useDispatch();

  const { isAuthenticated, user } =
    useSelector((state) => state.auth);

  useEffect(() => {
    const loadWishlist = async () => {
      if (
        !isAuthenticated ||
        user?.role !== "customer"
      ) {
        dispatch(setWishlist([]));
        return;
      }

      try {
        dispatch(setWishlistLoading(true));

        const response = await api.get(
          "/wishlist"
        );

        dispatch(
          setWishlist(
            response.data.wishlist?.products ||
              []
          )
        );
      } catch (error) {
        console.error(
          "LOAD WISHLIST ERROR:",
          error
        );

        dispatch(setWishlist([]));
      }
    };

    loadWishlist();
  }, [isAuthenticated, user?.role, dispatch]);

  return null;
}

export default WishlistLoader;
