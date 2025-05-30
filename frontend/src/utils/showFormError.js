// this is a utility function, wrote for displaying the vry first error of react-hook-form
import { toast } from "react-toastify";

const showFormErrors = (errors) => {
  if (errors && Object.keys(errors).length > 0) {
    const firstErrorKey = Object.keys(errors)[0];
    const firstError = errors[firstErrorKey];
    if (firstError?.message) {
      toast.error(firstError.message);
    }
  }
};

export default showFormErrors;
