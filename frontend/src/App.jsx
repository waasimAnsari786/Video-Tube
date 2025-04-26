import { useState } from "react";
import RegisterForm from "./components/auth/RegisterForm";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <RegisterForm />
    </>
  );
}

export default App;
