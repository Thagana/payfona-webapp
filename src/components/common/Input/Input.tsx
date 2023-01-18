import * as React from "react";
import { FieldErrorsImpl, UseFormRegister } from "react-hook-form";
import "./Input.scss";

type Props = {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  required: boolean;
  errors: FieldErrorsImpl<{
    email: string;
    password: string;
    firstName: string;
    activate: string;
  }>;
  type: string;
  placeholder: string;
  value: string;
};

export default function Input(props: Props) {
  const { label, register, required, errors, type, placeholder, value } = props;
  return (
    <>
      <label htmlFor={label} className="label">
        {label}
      </label>
      <input
        type={type}
        className="form-control"
        {...register(value, { required })}
        placeholder={placeholder}
      />
      {errors.firstName && (
        <div className="invalid-feedback">{errors.firstName.message}</div>
      )}
    </>
  );
}
