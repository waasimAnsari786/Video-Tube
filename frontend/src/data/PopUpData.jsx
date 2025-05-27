import {
  FaUpload,
  FaTrash,
  FaUser,
  FaYoutube,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

// each function has written for returning the data of pop-up component

// Return data of avatar's edit button's pop-up component in profile sectin or component
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
  settingRoute,
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
    icon: <FaCog />,
    text: "Setting",
    onClick: () => handleRoute(settingRoute),
  },
  {
    icon: <FaSignOutAlt />,
    text: "Logout",
    onClick: onLogout,
  },
];

export { getProfileAvatarContent, getSidebarAvatarContent };
