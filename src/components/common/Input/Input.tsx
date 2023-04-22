import * as React from "react";
import { FieldErrorsImpl, UseFormRegister } from "react-hook-form";
import "./Input.scss";

type Props = {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  required: boolean;
  errors: {
    [key: string]: any
  };
  isTouched: boolean;
  type: string;
  placeholder: string;
  value: string;
};

export default function Input(props: Props) {
  const { label, register, required, errors, type, placeholder, value, isTouched } = props;
  return (
    <>
      <label htmlFor={label} className="label">
        {label}
      </label>
      <input
        type={type}
        className={`form-control ${isTouched ? (errors[`${value}`] ? "is-invalid" : "is-valid") : "" }`}
        {...register(value, { required })}
        placeholder={placeholder}
      />
      {errors.firstName && (
        <div className="invalid-feedback">{errors.firstName.message}</div>
      )}
    </>
  );
}
