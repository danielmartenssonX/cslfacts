import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import CSLApp from '../../src/CSLApp.jsx';

expect.extend(toHaveNoViolations);

describe('A11y – Shell', () => {
  test('grundläge har inga grova a11y-avvikelser', async () => {
    const { container } = render(<CSLApp />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
