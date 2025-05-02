import { Outlet, useNavigate } from "react-router-dom";
import { Header, Footer } from "../../index";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getCurrentUserThunk,
  refreshAccessTokenThunk,
} from "../../features/authSlice";

const MyWebLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const currentUser = await dispatch(getCurrentUserThunk());
      if (!getCurrentUserThunk.fulfilled.match(currentUser)) {
        const refreshedToken = await dispatch(refreshAccessTokenThunk());
        if (!refreshAccessTokenThunk.fulfilled.match(refreshedToken)) {
          console.log("Refresh token error: ", refreshedToken.payload);
          navigate("/login");
        }
      }
      setLoading(false);
    })();
  }, []);
  return loading ? (
    <h1>Loading...</h1>
  ) : (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default MyWebLayout;
