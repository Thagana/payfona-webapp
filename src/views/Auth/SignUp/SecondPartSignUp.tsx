import * as React from "react";
import Notification from "antd/es/notification";
import { Link, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import PhoneInput from "react-phone-number-input/input";
import "./SignUp.scss";
import Server from "../../../networking/server";
import Input from "../../../components/common/Input";

type FirstInputs = {
  lastName: string;
  firstName: string;
  email: string;
};

type SecondInputs = {
  phoneNumber: string;
  password: string;
  businessName: string;
};

type Props = {
  data: FirstInputs;
};

export default function SecondPartSignUp(props: Props) {
  const { data: firstData } = props;
  const [isLoading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    getFieldState,
    formState: { errors, isValid, isDirty },
  } = useForm<SecondInputs>();

  const onSecondPartSubmit: SubmitHandler<SecondInputs> = async (
    data: SecondInputs,
  ) => {
    try {
      setLoading(true);
      const payload = { ...firstData, ...data };
      const response = await Server.Auth.registerUser({ ...payload });
      if (!response.data.success) {
        Notification.error({
          message: response.data.message,
        });
        setLoading(false);
      } else {
        setLoading(false);
        navigate("/login");
        Notification.success({
          message: response.data.message,
        });
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      Notification.error({
        message: "Something went wrong please try again later",
      });
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit(onSecondPartSubmit)}>
      <div className="form-group">
        <Input
          label="Password"
          register={register}
          required
          errors={errors}
          type="password"
          placeholder="Password"
          value="password"
          isTouched={getFieldState("password").isTouched}
        />
      </div>
      <div className="form-group">
        <Input
          label="Business Name"
          register={register}
          required
          errors={errors}
          type="text"
          placeholder="Business Name"
          value="businessName"
          isTouched={getFieldState("businessName").isTouched}
        />
      </div>
      <div className="form-group">
        <Controller
          control={control}
          name="phoneNumber"
          render={({
            field: { onChange, onBlur, value, name, ref },
            fieldState: { invalid, isTouched, isDirty, error },
            formState,
          }) => (
            <PhoneInput
              country="ZA"
              className={`form-control ${
                getFieldState("phoneNumber").isTouched
                  ? errors.phoneNumber
                    ? "is-invalid"
                    : "is-valid"
                  : ""
              }`}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              name={name}
              ref={ref}
              error={invalid && isTouched && isDirty}
              placeholder="Phone Number"
            />
          )}
        />
      </div>
      <div className="form-group">
        <Link to="/login" className="link">
          Already have an account? SignIn
        </Link>
      </div>
      <div className="form-group">
        <button className="btn btn-primary btn-lg">
          {isLoading ? "Submitting ..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
