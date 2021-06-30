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
          <input type="text" value={values.username} placeholder="Username" onChange={handleChange} id="username" />
        </Form>
      )}
    </Formik>
  );
}

export default Register;
