// it's a main file for importing and exporting all components throught out the app.
import FormButton from "./components/auth/auth reuseable components/FormButton";
import FormHeading from "./components/auth/auth reuseable components/FormHeading";
import FormInput from "./components/auth/auth reuseable components/FormInput";
import FormText from "./components/auth/auth reuseable components/FormText";
import InputContainer from "./components/auth/auth reuseable components/InputContainer";
import Logo from "./components/auth/auth reuseable components/Logo";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import UpdatePasswordForm from "./components/auth/UpdatePasswordForm";
import UpdateUserDetailsForm from "./components/auth/UpdateUserDetailsForm";
import Footer from "./components/layout/Footer";
import Header from "./components/Header/Header";
import MyWebLayout from "./components/layout/MyWebLayout";
import AuthProtectedLayout from "./components/resuseable-components/AuthProtectedLayout";
import Icon from "./components/resuseable-components/Icon";
import HomePage from "./components/pages/HomePage";
import ProfileSection from "./components/profile/ProfileSection";
import NavbarEnd from "./components/Navbar/NavbarEnd";
import Avatar from "./components/profile/Avatar";
import CoverImage from "./components/profile/CoverImage";
import FullName from "./components/profile/FullName";
import Email from "./components/profile/Email";
import Username from "./components/profile/Username";
import UpdateUserMediaForm from "./components/auth/UpdateUserMediaForm";
import Container from "./components/resuseable-components/Container";
import FileInputContainer from "./components/auth/auth reuseable components/FileInputContainer";
import ChannelDetails from "./components/profile/ChannelDetails";
import SubscribeButton from "./components/profile/SubscribeButton";
import SubscribedToCount from "./components/profile/SubscribedToCount";
import SubscribersCount from "./components/profile/SubscribersCount";
import DeleteMedia from "./components/auth/DeleteMedia";
import AddUpdateVideoForm from "./components/video/AddUpdateVideoForm";
import UploadVideoPage from "./components/pages/UploadVideoPage";
import UpdateVideoPage from "./components/pages/UpdateVideoPage";
import VideoCard from "./components/video/VideoCard";
import Button from "./components/resuseable-components/Button";
import PopUp from "./components/resuseable-components/PopUp";
import {
  getProfileAvatarContent,
  getSidebarAvatarContent,
} from "./data/PopUpData";
import UpdateMedia from "./components/profile/profile reuseable components/UpdateMedia";
import ImagePreview from "./components/profile/profile reuseable components/ImagePreview";
import MediaInput from "./components/profile/profile reuseable components/MediaInput";
import Row from "./components/resuseable-components/Row";
import Column from "./components/resuseable-components/Column";
import SearchForm from "./components/Header/header reuseable components/SearchForm";
import useToggle from "./hooks/useToggle";
import SidebarToggle from "./components/Header/header reuseable components/SidebarToggle";
import SideBarAvatar from "./components/layout/layout reuseable components/SideBarAvatar";
import useRoute from "./hooks/useRoute";
import SidebarAvatarButton from "./components/layout/layout reuseable components/SidebarAvatarButton";
import useFileUpload from "./hooks/useFileUpload";
import useImagePreview from "./hooks/useImagePreview";
import ProfileTitle from "./components/profile/profile reuseable components/ProfileTitle";
import CustomModal from "./components/resuseable-components/CustomModal";
import { ProfileMediaPopupContent } from "./classes/popupContent";
import openCloseModal from "./utils/openModel";
import { ProfileDeleteMediaModalContent } from "./classes/ModalContent.class";
import PasswordInputContainer from "./components/auth/auth reuseable components/PasswordInputContainer";
import Tabs from "./components/resuseable-components/Tabs";

export {
  FormButton,
  FormHeading,
  FormInput,
  FormText,
  Footer,
  InputContainer,
  Logo,
  LoginForm,
  RegisterForm,
  UpdatePasswordForm,
  UpdateUserDetailsForm,
  Header,
  MyWebLayout,
  AuthProtectedLayout,
  Icon,
  HomePage,
  ProfileSection,
  NavbarEnd,
  Avatar,
  CoverImage,
  FullName,
  Email,
  Username,
  UpdateUserMediaForm,
  Container,
  ImagePreview,
  FileInputContainer,
  ChannelDetails,
  SubscribeButton,
  SubscribedToCount,
  SubscribersCount,
  DeleteMedia,
  AddUpdateVideoForm,
  UploadVideoPage,
  UpdateVideoPage,
  VideoCard,
  Button,
  PopUp,
  getProfileAvatarContent,
  getSidebarAvatarContent,
  UpdateMedia,
  MediaInput,
  Row,
  Column,
  SearchForm,
  useToggle,
  SidebarToggle,
  SideBarAvatar,
  useRoute,
  SidebarAvatarButton,
  useFileUpload,
  useImagePreview,
  ProfileTitle,
  CustomModal,
  ProfileMediaPopupContent, //it's a class,
  openCloseModal, //it's a utility func
  ProfileDeleteMediaModalContent, //its a class
  PasswordInputContainer,
  Tabs,
};
