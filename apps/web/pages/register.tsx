import { Formik, Form } from "formik";
import { useMutation } from "urql";

import { InputField } from "@notreddit/web/web-shared";

/* eslint-disable-next-line */
export interface RegisterProps { }

const REGISTER_MUTATION = `
mutation Register($username: String!, $password: String!) {
  register(input: { username: $username, password: $password }) {
    user {
      id
      username
    }
    errors {
      field
      message
    }
  }
}
`

export function Register(props: RegisterProps) {
  const [, register] = useMutation(REGISTER_MUTATION)
  return (
    <div className="justify-center flex items-center h-screen">
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (vals) => {
          const res = await register(vals)
        }}
      >
        {({ values, handleChange, isSubmitting }) => (
          <Form className="card shadow-2xl w-3/12 p-10">
            <p className="text-center font-semibold text-2xl">Register</p>
            <InputField name="username" placeholder="karma" label="Username" type="text" />
            <InputField name="password" placeholder="n0t_r3dd1t" label="Password" type="password" />

            <button type="submit" className={isSubmitting ? "btn btn-primary loading mt-6" : "btn btn-primary mt-6"}>Register</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Register;
