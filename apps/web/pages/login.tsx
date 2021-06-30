import { useRouter } from "next/router";
import { Formik, Form } from "formik";

import { InputField } from "@notreddit/web/web-shared";
import { toErrorMap } from "@notreddit/web/web-utils";

import { useLoginMutation } from "../generated/graphql";
import { useState } from "react";

/* eslint-disable-next-line */
export interface LoginProps { }

export function Login(props: LoginProps) {
  const router = useRouter()
  const [, login] = useLoginMutation()
  return (
    <div className="flex items-center justify-center h-screen">
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (vals, { setErrors }) => {
          const res = await login(vals)

          if (res.data?.login.errors) {
            setErrors(toErrorMap(res.data.login.errors))
          } else if (res.data?.login.user.username) {
            router.push('/')
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="w-3/12 p-10 shadow-2xl card">
            <p className="text-2xl font-semibold text-center">Log In</p>
            <InputField name="username" placeholder="karma" label="Username" type="text" />
            <InputField name="password" placeholder="n0t_r3dd1t" label="Password" type="password" />
            <InputField name="login" type="text" hidden={true} />
            <button type="submit" className={isSubmitting ? "btn btn-primary loading mt-6" : "btn btn-primary mt-6"}>Log In</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Login;
