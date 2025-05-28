import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
          <LoginForm />
        </AuthProtectedLayout>
      ),
    },
    {
      path: "/register",
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
          element: <HomePage />,
        },
        {
          path: "/profile",
          element: (
            // <AuthProtectedLayout>
            //   <ProfileSection />
            // </AuthProtectedLayout>

            <ProfileSection />
          ),
        },
        {
          path: "/:channelName",
          element: (
            <AuthProtectedLayout>
              <ChannelDetails />
            </AuthProtectedLayout>
          ),
        },
        {
          path: "/video/publish",
          element: (
            <AuthProtectedLayout>
              <UploadVideoPage />
            </AuthProtectedLayout>
          ),
        },
        {
          path: "/video/update/:videoId",
          element: (
            <AuthProtectedLayout>
              <UpdateVideoPage />
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
