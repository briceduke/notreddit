import { useField } from "formik";
import { InputHTMLAttributes } from "react";

export type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  placeholder?: string;
  name: string;
}

export function InputField(props: InputFieldProps) {
  const [field, { error }] = useField(props)
  return (
    <>
      <label htmlFor={field.name}>{props.label}</label>
      <br />
      <input type="text" {...field} placeholder={props.placeholder} id={field.name} />
      {error ? <span style={{ color: 'red' }} >{error}</span> : null}
    </>
  );
}

export default InputField;
