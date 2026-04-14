import { render, screen } from '@testing-library/react';
import CSLApp from '../../src/CSLApp.jsx';

describe('AppShell', () => {
  test('renderar appskal', () => {
    render(<CSLApp />);
    expect(screen.getByTestId('app-shell')).toBeInTheDocument();
  });

  test('visar sekretessvarning vid start', () => {
    render(<CSLApp />);
    expect(screen.getByTestId('secrecy-modal')).toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Sekretessvarning' })).toBeInTheDocument();
  });
});
