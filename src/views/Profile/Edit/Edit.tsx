import * as React from "react";
import { useLocation } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import Notification from "antd/es/notification";
import { useNavigate } from "react-router-dom";
import TemplateWrapper from "../../Template";
import Button from "../../../components/common/Button";
import Server from "../../../networking/server";
import { useStoreActions } from "easy-peasy";
import { Model } from "../../../store/model";

import "./Edit.scss";

export default function Edit() {
  const location = useLocation();
  const navigate = useNavigate();

  const [firstName, setFirstName] = React.useState(location.state.firstName);
  const [lastName, setLastName] = React.useState(location.state.lastName);

  const [file, setFile] = React.useState<any>();

  const updateProfile = useStoreActions<Model>(
    (action) => action.updateProfile
  );

  const handleUpdateFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setFirstName(value);
  };

  const handleUpdateLastName = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.currentTarget.value;
    setLastName(value);
  };

  const handleUpdatingInformation = async () => {
    try {
      const response = await Server.Users.updateProfile({
        firstName,
        lastName,
      });
      if (!response.data.success) {
        Notification.error({
          message: response.data.message,
        });
      } else {
        // update global state
        updateProfile({ type: 'NAMES', firstName, lastName });
        navigate("/profile");
        Notification.success({
          message: "Successfully update profile information",
        });
      }
    } catch (error) {
      console.log(error);
      Notification.error({
        message: "Something went wrong, please try again later",
      });
    }
  };

  const handleChange = async (e: any) => {
    try {
      const data = new FormData();
      data.append("profile", e.currentTarget.files[0]);
      const response = await Server.Users.updateProfileImage(data);
      if (!response.data.success) {
        Notification.error({
          message: response.data.message,
        });
      } else {
        navigate("/profile");
        updateProfile({ type: 'PROFILE', avatar: response.data.url })
        Notification.success({
          message: "Successfully update profile information",
        });
      }
    } catch (error) {
      console.log(error);
      Notification.error({
        message: "Something went wrong please try again later",
      });
    }
  };

  return (
    <TemplateWrapper defaultIndex="7">
      <div className="profile-container-edit">
        <div className="container-container">
          <div className="image-container">
            <img src={location.state.avatar} className="image" />
            <div className="pencil-container">
              <EditOutlined size={40} />
            </div>
          </div>
          <input
            className="form-control"
            type="file"
            id="formFile"
            onChange={handleChange}
          />
          <div className="details">
            <div className="form-group">
              <label>First Name</label>
              <input
                name="firstName"
                placeholder="First Name"
                value={firstName}
                onChange={handleUpdateFirstName}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                name="lastName"
                placeholder="Last Name"
                value={lastName}
                onChange={handleUpdateLastName}
                className="form-control"
              />
            </div>
          </div>
          <div className="edit-container">
            <Button type="primary" clickHandler={handleUpdatingInformation}>
              Update Profile
            </Button>
          </div>
        </div>
      </div>
    </TemplateWrapper>
  );
}
