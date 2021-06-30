import { Formik, Form } from "formik";
import { render } from '@testing-library/react';

import InputField from '.';

describe('InputField', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Formik
      initialValues={{ username: '', password: '' }}
      onSubmit={() => {
        //
      }}
    >
      {() => (
        <Form>
          <InputField name="test" placeholder="test" label="test" />
        </Form>
      )}
    </Formik>);

    expect(baseElement).toBeTruthy();
  });
});
