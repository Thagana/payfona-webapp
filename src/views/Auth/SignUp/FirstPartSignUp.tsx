import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Navigation from "antd/es/notification";

import "./SignUp.scss";
import Input from "../../../components/common/Input";

type FirstInputs = {
  lastName: string;
  firstName: string;
  email: string;
};

type Props = {
  onNavigateNext(data: FirstInputs): void;
};

export default function FirstPartSignUp(props: Props) {
  const { onNavigateNext } = props;
  const {
    register,
    handleSubmit,
    control,
    getFieldState,
    formState: { errors, isValid, isDirty },
  } = useForm<FirstInputs>();

  const onFirstPartSubmit: SubmitHandler<FirstInputs> = async (
    data: FirstInputs,
  ) => {
    try {
      onNavigateNext({
        ...data,
      });
    } catch (error) {
      Navigation.error({
        message: "Something went wrong please try again later",
      });
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit(onFirstPartSubmit)}>
      <div className="form-group">
        <Input
          label="First Name"
          register={register}
          required
          errors={errors}
          type="text"
          placeholder="First Name"
          value="firstName"
          isTouched={getFieldState("firstName").isTouched}
        />
      </div>
      <div className="form-group">
        <Input
          label="Last Name"
          register={register}
          required
          errors={errors}
          type="text"
          placeholder="Last Name"
          value="lastName"
          isTouched={getFieldState("lastName").isTouched}
        />
      </div>
      <div className="form-group">
        <Input
          label="Email"
          register={register}
          required
          errors={errors}
          type="email"
          placeholder="Email"
          value="email"
          isTouched={getFieldState("email").isTouched}
        />
      </div>
      <div className="form-group">
        <Link to="/login" className="link">
          Already have an account? SignIn
        </Link>
      </div>
      <div className="form-group">
        <button className="btn btn-primary btn-lg">Next</button>
      </div>
    </form>
  );
}
