import { useRouter } from "next/router";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";

import { InputField } from "@notreddit/web/web-shared";
import { createUrqlClient, toErrorMap } from "@notreddit/web/web-utils";

import { useRegisterMutation } from "../generated/graphql";

/* eslint-disable-next-line */
export interface RegisterProps { }

export function Register(props: RegisterProps) {
  const router = useRouter()
  const [, register] = useRegisterMutation()
  return (
    <div className="flex items-center justify-center h-screen">
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (vals, { setErrors }) => {
          const res = await register(vals)

          if (res.data?.register.errors.length !== 0) {
            setErrors(toErrorMap(res.data.register.errors))
          } else if (res.data?.register.user) {
            router.push('/')
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="w-3/12 p-10 shadow-2xl card">
            <p className="text-2xl font-semibold text-center">Register</p>
            <InputField name="username" placeholder="karma" label="Username" type="text" />
            <InputField name="password" placeholder="n0t_r3dd1t" label="Password" type="password" />

            <button type="submit" className={isSubmitting ? "btn btn-primary loading mt-6" : "btn btn-primary mt-6"}>Register</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Register);
