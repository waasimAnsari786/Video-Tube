import {
  FaUpload,
  FaTrash,
  FaUser,
  FaYoutube,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

// each function has written for returning the data of pop-up component

// Return data of avatar's edit button's pop-up component in ProfileSectin.jsx
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

// Return data avatar pop-up component in MyWebLayout.jsx's sidebar component
const getSidebarAvatarContent = ({
  profileRoute,
  channelRoute,
  onLogout,
  handleRoute,
}) => [
  {
    icon: <FaUser />,
    text: "Profile",
    onClick: () => handleRoute(profileRoute),
  },
  {
    icon: <FaYoutube />,
    text: "Channel",
    onClick: () => handleRoute(channelRoute),
  },
  {
    icon: <FaSignOutAlt />,
    text: "Logout",
    onClick: onLogout,
  },
];

export { getProfileAvatarContent, getSidebarAvatarContent };
