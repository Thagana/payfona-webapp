import * as React from "react";
import { FieldValues, UseFormRegister, FieldError } from "react-hook-form";
import "./Input.scss";

type Props<T extends FieldValues> = {
  label: string;
  register: UseFormRegister<T>;
  required: boolean;
  errors: {
    [key: string]: FieldError | undefined;
  };
  isTouched: boolean;
  type: string;
  placeholder: string;
  value: string;
};

export default function Input<T extends FieldValues>(props: Props<T>) {
  const {
    label,
    register,
    required,
    errors,
    type,
    placeholder,
    value,
    isTouched,
  } = props;
  return (
    <>
      <label htmlFor={label} className="label">
        {label}
      </label>
      <input
        type={type}
        className={`form-control ${isTouched ? (errors[`${value}`] ? "is-invalid" : "is-valid") : ""}`}
        {...register(value, { required })}
        placeholder={placeholder}
      />
      {errors.firstName && (
        <div className="invalid-feedback">{errors.firstName.message}</div>
      )}
    </>
  );
}
