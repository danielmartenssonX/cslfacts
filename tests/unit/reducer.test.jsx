import { createInitialState, cslReducer, deriveState } from '../../src/CSLApp.jsx';

describe('CSL Reducer', () => {
  test('createInitialState skapar giltig state', () => {
    const state = createInitialState();
    expect(state.documents).toEqual({});
    expect(state.index).toEqual([]);
    expect(state.activeId).toBeNull();
    expect(state.secrecyDismissed).toBe(false);
  });

  test('DISMISS_SECRECY sätter secrecyDismissed till true', () => {
    const state = createInitialState();
    const next = cslReducer(state, { type: 'DISMISS_SECRECY' });
    expect(next.secrecyDismissed).toBe(true);
  });

  test('okänd action returnerar oförändrad state', () => {
    const state = createInitialState();
    const next = cslReducer(state, { type: 'UNKNOWN_ACTION' });
    expect(next).toBe(state);
  });

  test('deriveState beräknar hasActiveDocument korrekt', () => {
    const state = createInitialState();
    const derived = deriveState(state);
    expect(derived.hasActiveDocument).toBe(false);
    expect(derived.documentCount).toBe(0);
  });
});
