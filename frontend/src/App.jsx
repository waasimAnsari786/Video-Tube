import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  MyWebLayout,
  HomePage,
  AuthProtectedLayout,
  ProfileSection,
  ChannelDetails,
  UploadVideoPage,
  UpdateVideoPage,
  WatchPage,
  RegistrationPage,
  LoginPage,
} from "./index";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { store } from "./store/store";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: (
        <AuthProtectedLayout authentication={false}>
          <LoginPage />
        </AuthProtectedLayout>
      ),
    },
    {
      path: "/register",
      element: (
        <AuthProtectedLayout authentication={false}>
          <RegistrationPage />
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
    </>
  );
};

export default App;
