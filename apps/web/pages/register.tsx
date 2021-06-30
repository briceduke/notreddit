import { InputField } from "@notreddit/web/web-shared";
import { Formik, Form } from "formik";

/* eslint-disable-next-line */
export interface RegisterProps { }

export function Register(props: RegisterProps) {
  return (
    <div className="justify-center flex items-center h-screen">
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={(vals) => {
          console.log(vals);
        }}
      >
        {({ values, handleChange, isSubmitting }) => (
          <Form className="card shadow-2xl w-3/12 p-10">
            <p className="text-center font-semibold text-2xl">Register</p>
            <InputField name="username" placeholder="karma" label="Username" type="text" />
            <InputField name="password" placeholder="r3dd1t" label="Password" type="password" />
            <button type="submit" className={isSubmitting ? "btn btn-primary loading" : "btn btn-primary"}>Register</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Register;
