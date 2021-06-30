import { useField } from "formik";
import { InputHTMLAttributes } from "react";

export type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  placeholder?: string;
  hidden?: boolean;
  type: string;
  name: string;
}

export function InputField(props: InputFieldProps) {
  const [field, { error }] = useField(props)
  return (
    <div>
      <div className={props.hidden ? "hidden" : ""}>
        <label className="label" htmlFor="field.name">
          <span className="label-text">{props.label}</span>
        </label>
        <input {...field} {...props} type={props.type} placeholder={props.placeholder} id={field.name} className="w-full input" />
        <br />
      </div>
      {error ? <p style={{ color: 'red' }} className="pt-4 text-center" >{error}</p> : null}
    </div>
  );
}

export default InputField;
