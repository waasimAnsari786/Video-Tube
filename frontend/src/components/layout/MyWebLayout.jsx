import { Outlet, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCurrentUserThunk } from "../../features/authSlice";

const MyWebLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const currentUser = await dispatch(getCurrentUserThunk());
      if (!getCurrentUserThunk.fulfilled.match(currentUser)) {
        navigate("/login");
      }
    })();
  }, []);
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default MyWebLayout;
