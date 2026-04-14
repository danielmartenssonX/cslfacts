import { describe, expect, it } from 'vitest';
import { buildInvestigationItems } from '../../src/services/investigationBuilder';
import type { Answer, Question } from '../../src/domain/types';

const mockQuestions: Partial<Question>[] = [
  {
    id: 'Q01',
    text: 'Vet du vad systemet används till?',
    blocking: true,
    investigationHint: 'Ta fram systembeskrivning.',
    whoCanAnswer: ['Systemägare'],
  },
  {
    id: 'Q05',
    text: 'Vet du om leverantörer kan komma åt systemet?',
    blocking: false,
    investigationHint: 'Fråga systemägare.',
    whoCanAnswer: ['Systemägare', 'Driftansvarig'],
  },
  {
    id: 'Q16',
    text: 'Kan fel bidra till radiologisk händelse?',
    blocking: true,
    investigationHint: 'Ta in bedömning från säkerhetsanalys.',
    whoCanAnswer: ['Säkerhetsanalytiker'],
  },
];

describe('investigationBuilder', () => {
  it('skapar utredningspunkter för UNCLEAR-svar', () => {
    const answers: Answer[] = [
      { questionId: 'Q01', value: 'UNCLEAR' },
      { questionId: 'Q05', value: 'YES' },
      { questionId: 'Q16', value: 'UNCLEAR' },
    ];

    const items = buildInvestigationItems(answers, mockQuestions as Question[]);

    expect(items).toHaveLength(2);
    expect(items[0].questionId).toBe('Q01');
    expect(items[0].blocksFinalization).toBe(true);
    expect(items[1].questionId).toBe('Q16');
    expect(items[1].blocksFinalization).toBe(true);
  });

  it('markerar icke-blockerande frågor korrekt', () => {
    const answers: Answer[] = [{ questionId: 'Q05', value: 'UNCLEAR' }];

    const items = buildInvestigationItems(answers, mockQuestions as Question[]);

    expect(items).toHaveLength(1);
    expect(items[0].blocksFinalization).toBe(false);
    expect(items[0].whoCanAnswer).toEqual(['Systemägare', 'Driftansvarig']);
  });

  it('returnerar tom lista om inga UNCLEAR-svar finns', () => {
    const answers: Answer[] = [
      { questionId: 'Q01', value: 'YES' },
      { questionId: 'Q16', value: 'NO' },
    ];

    const items = buildInvestigationItems(answers, mockQuestions as Question[]);
    expect(items).toHaveLength(0);
  });

  it('kastar fel om fråga saknas', () => {
    const answers: Answer[] = [{ questionId: 'Q99', value: 'UNCLEAR' }];

    expect(() => buildInvestigationItems(answers, mockQuestions as Question[])).toThrow(
      'Question not found for answer: Q99',
    );
  });

  it('alla utredningspunkter har status NOT_STARTED', () => {
    const answers: Answer[] = [
      { questionId: 'Q01', value: 'UNCLEAR' },
      { questionId: 'Q05', value: 'UNCLEAR' },
    ];

    const items = buildInvestigationItems(answers, mockQuestions as Question[]);
    expect(items.every((i) => i.status === 'NOT_STARTED')).toBe(true);
  });
});
