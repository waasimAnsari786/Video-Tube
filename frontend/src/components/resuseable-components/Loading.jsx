import ReactDOM from "react-dom";
import { FaSpinner } from "react-icons/fa";

export default function Loading() {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black opacity-50 flex justify-center items-center z-[50]">
      <FaSpinner className="animate-spin text-white text-6xl" />
    </div>,
    document.body
  );
}
