import { FaUpload, FaTrash } from "react-icons/fa";

const getProfileAvatarContent = ({ onUpload, onDelete }) => [
  {
    icon: <FaUpload />,
    text: "Upload new",
    onClick: onUpload,
  },
  {
    icon: <FaTrash />,
    text: "Delete avatar",
    onClick: onDelete,
  },
];

export { getProfileAvatarContent };
