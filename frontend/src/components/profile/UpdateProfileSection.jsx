import React from "react";
import {
  UpdateUserDetailsForm,
  Logo,
  UpdatePasswordForm,
  UpdateUserMediaForm,
  Container,
} from "../../index";

export default function UpdateProfileSection() {
  return (
    <Container childElemClass="py-10 px-4">
      <Logo src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" />

      {/* Account details settings */}
      <div className="collapse collapse-arrow bg-base-100 border border-base-300">
        <input type="radio" name="faq-accordion" defaultChecked />
        <div className="collapse-title font-semibold flex items-center gap-2">
          <i className="ti-user"></i>
          Account Details
          <span className="text-sm block text-gray-500">
            Update your account details
          </span>
        </div>
        <div className="collapse-content">
          <UpdateUserDetailsForm />
        </div>
      </div>

      {/* passowrd setting */}
      <div className="collapse collapse-arrow bg-base-100 border border-base-300">
        <input type="radio" name="faq-accordion" />
        <div className="collapse-title font-semibold flex items-center gap-2">
          <i className="ti-credit-card"></i>
          Password
          <span className="text-sm block text-gray-500">
            Update your account password
          </span>
        </div>
        <div className="collapse-content">
          <UpdatePasswordForm />
        </div>
      </div>
      {/* avatar setting */}
      <div className="collapse collapse-arrow bg-base-100 border border-base-300">
        <input type="radio" name="faq-accordion" />
        <div className="collapse-title font-semibold flex items-center gap-2">
          <i className="ti-credit-card"></i>
          Avatar
          <span className="text-sm block text-gray-500">
            Update your account avatar
          </span>
        </div>
        <div className="collapse-content">
          <UpdateUserMediaForm media={"avatar"} />
        </div>
      </div>
      {/* coverImage setting */}
      <div className="collapse collapse-arrow bg-base-100 border border-base-300">
        <input type="radio" name="faq-accordion" />
        <div className="collapse-title font-semibold flex items-center gap-2">
          <i className="ti-credit-card"></i>
          Cover Image
          <span className="text-sm block text-gray-500">
            Update your account cover image
          </span>
        </div>
        <div className="collapse-content">
          <UpdateUserMediaForm media={"coverImage"} />
        </div>
      </div>
    </Container>
  );
}
