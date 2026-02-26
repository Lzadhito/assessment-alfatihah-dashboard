export type AyatErrors = {
    jaliy: string[];
    khafiy: string[];
};

export type ScoreLabel = {
    title: string;
    description: string;
    tone: string;
};

export type Scores = Record<string, number> & {
    minScore: {
        score: number;
        label: ScoreLabel;
    };
};

export type Evaluation = {
    id: string;
    kode_unik: string;
    nama_lengkap: string | null;
    pemeriksa: string | null;
    kegiatan: string | null;
    asal_halaqah: string | null;
    rekomendasi_program: string | null;
    created_at: string | null;
    ayat_1: AyatErrors | null;
    ayat_2: AyatErrors | null;
    ayat_3: AyatErrors | null;
    ayat_4: AyatErrors | null;
    ayat_5: AyatErrors | null;
    ayat_6: AyatErrors | null;
    ayat_7: AyatErrors | null;
    ayat_7_part_2: AyatErrors | null;
    scores: Scores;
};
