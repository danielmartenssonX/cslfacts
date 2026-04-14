import { render, screen } from '@testing-library/react';
import CSLApp from '../../src/CSLApp.jsx';
import { TEST_IDS } from '../../src/testIds.js';

describe('AppShell', () => {
  test('renderar appskal med sidopanel och innehållsyta', () => {
    render(<CSLApp />);
    expect(screen.getByTestId(TEST_IDS.appShell)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.sidebar)).toBeInTheDocument();
    expect(screen.getByTestId(TEST_IDS.contentRegion)).toBeInTheDocument();
  });

  test('visar sekretessvarning vid start', () => {
    render(<CSLApp />);
    expect(screen.getByTestId(TEST_IDS.secrecyModal)).toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Sekretessvarning' })).toBeInTheDocument();
  });
});
