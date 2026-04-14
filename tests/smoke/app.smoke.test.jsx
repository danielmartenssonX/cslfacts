import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CSLApp from '../../src/CSLApp.jsx';

describe('Smoke suite', () => {
  test('appen renderar och sekretessvarningen kan stängas', async () => {
    const user = userEvent.setup();
    render(<CSLApp />);

    expect(screen.getByTestId('secrecy-modal')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Jag förstår' }));
    expect(screen.queryByTestId('secrecy-modal')).not.toBeInTheDocument();
    // Wizard visas efter sekretessvarningen
    expect(screen.getByText('CSL-verktyget')).toBeInTheDocument();
    expect(screen.getByText('Grundfakta')).toBeInTheDocument();
  });
});
