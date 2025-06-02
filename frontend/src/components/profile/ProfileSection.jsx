import React from "react";
import {
  ProfileTitle,
  UpdatePasswordForm,
  UpdateUserDetailsForm,
  Tabs,
  UpdateMediaForm,
} from "../../index";

const ProfileSection = () => {
  return (
    <Tabs tabs={["Media", "Details", "Security"]}>
      <div label="Media">
        <UpdateMediaForm />
      </div>

      <div label="Details">
        <UpdateUserDetailsForm />
      </div>

      <div label="Security">
        <UpdatePasswordForm />
      </div>
    </Tabs>
  );
};

export default ProfileSection;
