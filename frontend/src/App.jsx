import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import HomePage from "./components/pages/HomePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { store } from "./store/store";
import MyWebLayout from "./components/layout/MyWebLayout";
import UpdateUserDetailsForm from "./components/auth/UpdateUserDetailsForm";
import UpdatePasswordForm from "./components/auth/updatePasswordForm";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MyWebLayout />,
      children: [
        {
          path: "",
          element: <HomePage />,
        },
        {
          path: "/login",
          element: <LoginForm />,
        },
        {
          path: "/register",
          element: <RegisterForm />,
        },
        {
          path: "/details",
          element: <UpdateUserDetailsForm />,
        },
        {
          path: "/password",
          element: <UpdatePasswordForm />,
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
