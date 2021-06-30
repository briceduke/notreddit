import { useField } from "formik";
import { InputHTMLAttributes } from "react";

export type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  placeholder?: string;
  type: string;
  name: string;
}

export function InputField(props: InputFieldProps) {
  const [field, { error }] = useField(props)
  return (
    <div>
      <label className="label" htmlFor="field.name">
        <span className="label-text">{props.label}</span>
      </label>
      <input {...field} {...props} type={props.type} placeholder={props.placeholder} id={field.name} className="input w-full" />
      <br />
      {error ? <span style={{ color: 'red' }} >{error}</span> : null}
    </div>
  );
}

export default InputField;
