export const EVALUATION_OPTION_KEYS = [
    'ayat_1',
    'ayat_2',
    'ayat_3',
    'ayat_4',
    'ayat_5',
    'ayat_6',
    'ayat_7',
    'ayat_7_part_2',
] as const;

export type EvaluationOptionKey = (typeof EVALUATION_OPTION_KEYS)[number];

export const UNIQUE_CODE_LENGTH = 8;
