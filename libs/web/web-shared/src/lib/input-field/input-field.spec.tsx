import { render } from '@testing-library/react';

import InputField from '.';

describe('InputField', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<InputField name="test" placeholder="test" label="test" />);
    expect(baseElement).toBeTruthy();
  });
});
