import { createInitialAssessment } from '../../src/state/assessmentStore';

describe('CSL Assessment State', () => {
  test('createInitialAssessment skapar giltig state', () => {
    const state = createInitialAssessment();
    expect(state.answers).toEqual([]);
    expect(state.functions).toEqual([]);
    expect(state.result).toBeNull();
    expect(state.currentStep).toBe(0);
    expect(state.systemName).toBe('');
  });

  test('initial state har korrekt struktur', () => {
    const state = createInitialAssessment();
    expect(state.id).toBeTruthy();
    expect(state.createdAt).toBeTruthy();
    expect(state.updatedAt).toBeTruthy();
    expect(state.facilityName).toBe('');
    expect(state.assessor).toBe('');
  });

  test('varje nytt assessment får unikt ID', () => {
    const a = createInitialAssessment();
    const b = createInitialAssessment();
    expect(a.id).not.toBe(b.id);
  });
});
