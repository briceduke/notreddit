import { InputField } from "@notreddit/web/web-shared";
import { Formik, Form } from "formik";

/* eslint-disable-next-line */
export interface RegisterProps { }

export function Register(props: RegisterProps) {
  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      onSubmit={(vals) => {
        console.log(vals);
      }}
    >
      {({ values, handleChange }) => (
        <Form>
          <InputField name="username" placeholder="Username" label="Username" />
        </Form>
      )}
    </Formik>
  );
}

export default Register;
