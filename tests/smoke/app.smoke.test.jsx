import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CSLApp from '../../src/CSLApp.jsx';
import { TEST_IDS } from '../../src/testIds.js';

describe('Smoke suite', () => {
  test('appen renderar och sekretessvarningen kan stängas', async () => {
    const user = userEvent.setup();
    render(<CSLApp />);

    expect(screen.getByTestId(TEST_IDS.secrecyModal)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Jag förstår' }));
    expect(screen.queryByTestId(TEST_IDS.secrecyModal)).not.toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.contentRegion)).toBeInTheDocument();
  });
});
