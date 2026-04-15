import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CSLApp from '../../src/CSLApp.jsx';

describe('Smoke suite', () => {
  test('appen renderar, sekretessvarningen kan stängas och assessment-listan visas', async () => {
    const user = userEvent.setup();
    render(<CSLApp />);

    expect(screen.getByTestId('secrecy-modal')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Jag förstår' }));
    expect(screen.queryByTestId('secrecy-modal')).not.toBeInTheDocument();
    // Assessment-lista visas
    expect(screen.getByText('cslFacts')).toBeInTheDocument();
    expect(screen.getByText('Ny klassning')).toBeInTheDocument();
  });

  test('ny klassning öppnar wizarden', async () => {
    const user = userEvent.setup();
    render(<CSLApp />);

    await user.click(screen.getByRole('button', { name: 'Jag förstår' }));
    await user.click(screen.getByText('Ny klassning'));
    // Wizarden visas med Steg 1
    expect(screen.getByText('Grundfakta')).toBeInTheDocument();
    expect(screen.getByLabelText('Systemnamn')).toBeInTheDocument();
  });
});
