import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import {
  LoginForm,
  RegisterForm,
  MyWebLayout,
  HomePage,
  AuthProtectedLayout,
  ProfileSection,
  ChannelDetails,
  UploadVideoPage,
  UpdateVideoPage,
  WatchPage,
  AuthOptions,
} from "./index";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { GOOGLE_CLIENT_ID } from "./constant";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: (
        <AuthProtectedLayout authentication={false}>
          <LoginForm />
        </AuthProtectedLayout>
      ),
    },
    {
      path: "/register",
      element: (
        <AuthProtectedLayout authentication={false}>
          <AuthOptions />
          {/* <RegisterForm /> */}
        </AuthProtectedLayout>
      ),
    },
    {
      path: "/signup",
      element: (
        <AuthProtectedLayout authentication={false}>
          <RegisterForm />
        </AuthProtectedLayout>
      ),
    },
    {
      path: "/",
      element: <MyWebLayout />,
      children: [
        {
          path: "",
          element: (
            <AuthProtectedLayout authentication={false}>
              <HomePage />
            </AuthProtectedLayout>
          ),
        },
        {
          path: "/profile",
          element: (
            <AuthProtectedLayout>
              <ProfileSection />
            </AuthProtectedLayout>

            // <ProfileSection />
          ),
        },
        {
          path: "/:channelName",
          element: (
            // <ChannelDetails />

            <AuthProtectedLayout>
              <ChannelDetails />
            </AuthProtectedLayout>
          ),
        },
        {
          path: "/video/publish",
          element: (
            // <UploadVideoPage />

            <AuthProtectedLayout>
              <UploadVideoPage />
            </AuthProtectedLayout>
          ),
        },
        {
          path: "/video/update/:videoId",
          element: (
            // <UpdateVideoPage />

            <AuthProtectedLayout>
              <UpdateVideoPage />
            </AuthProtectedLayout>
          ),
        },
        {
          path: "/single",
          element: (
            <AuthProtectedLayout authentication={false}>
              <WatchPage />
            </AuthProtectedLayout>
          ),
        },
      ],
    },
  ]);

  return (
    <>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <Provider store={store}>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition:Bounce
          />
          <RouterProvider router={router} />
        </Provider>
      </GoogleOAuthProvider>
    </>
  );
};

export default App;
