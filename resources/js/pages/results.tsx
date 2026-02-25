import { Head, Link } from '@inertiajs/react';
import { index } from '@/actions/App/Http/Controllers/EvaluationController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type AyatErrors = {
    jaliy: string[];
    khafiy: string[];
};

type Evaluation = {
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
};

type Props = {
    evaluation: Evaluation;
};

const AYAT_LABELS: Record<string, string> = {
    ayat_1: 'Ayat 1 – بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
    ayat_2: 'Ayat 2 – الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    ayat_3: 'Ayat 3 – الرَّحْمَنِ الرَّحِيمِ',
    ayat_4: 'Ayat 4 – مَالِكِ يَوْمِ الدِّينِ',
    ayat_5: 'Ayat 5 – إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
    ayat_6: 'Ayat 6 – اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
    ayat_7: 'Ayat 7 (Bagian 1) – صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ',
    ayat_7_part_2:
        'Ayat 7 (Bagian 2) – غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
};

const AYAT_KEYS = Object.keys(AYAT_LABELS) as (keyof Evaluation)[];

export default function Results({ evaluation }: Props) {
    const hasAnyErrors = AYAT_KEYS.some((key) => {
        const ayat = evaluation[key] as AyatErrors | null;
        return (
            (ayat?.jaliy?.length ?? 0) > 0 || (ayat?.khafiy?.length ?? 0) > 0
        );
    });

    return (
        <>
            <Head title={`Hasil – ${evaluation.nama_lengkap ?? 'Peserta'}`} />

            <div className="min-h-screen bg-background px-4 py-10">
                <div className="mx-auto max-w-2xl space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">
                                Hasil Evaluasi
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Kode:{' '}
                                <span className="font-mono font-medium">
                                    {evaluation.kode_unik}
                                </span>
                            </p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={index()}>Kembali</Link>
                        </Button>
                    </div>

                    {/* Info Card */}
                    <div className="space-y-3 rounded-xl border bg-card p-6">
                        <h2 className="text-base font-semibold">
                            Informasi Peserta
                        </h2>
                        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                            <div>
                                <dt className="text-muted-foreground">
                                    Nama Lengkap
                                </dt>
                                <dd className="font-medium">
                                    {evaluation.nama_lengkap ?? '-'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">
                                    Jenis Kelamin
                                </dt>
                                <dd className="font-medium">
                                    {evaluation.asal_halaqah ?? '-'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">
                                    Kegiatan
                                </dt>
                                <dd className="font-medium">
                                    {evaluation.kegiatan ?? '-'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">
                                    Pemeriksa
                                </dt>
                                <dd className="font-medium">
                                    {evaluation.pemeriksa ?? '-'}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    {/* Recommendation */}
                    {evaluation.rekomendasi_program && (
                        <div className="flex items-center justify-between gap-4 rounded-xl border bg-card p-6">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Rekomendasi Program
                                </p>
                                <p className="mt-0.5 text-base font-semibold">
                                    {evaluation.rekomendasi_program}
                                </p>
                            </div>
                            <Badge
                                variant="secondary"
                                className="whitespace-nowrap"
                            >
                                {evaluation.rekomendasi_program}
                            </Badge>
                        </div>
                    )}

                    {/* Ayat Errors */}
                    <div className="space-y-4">
                        <h2 className="text-base font-semibold">
                            Detail Kesalahan per Ayat
                        </h2>

                        {!hasAnyErrors && (
                            <div className="rounded-xl border bg-card p-6 text-center text-sm text-muted-foreground">
                                Tidak ada kesalahan yang tercatat.
                            </div>
                        )}

                        {AYAT_KEYS.map((key) => {
                            const ayat = evaluation[key] as AyatErrors | null;
                            const jaliyCount = ayat?.jaliy?.length ?? 0;
                            const khafiyCount = ayat?.khafiy?.length ?? 0;

                            if (jaliyCount === 0 && khafiyCount === 0)
                                return null;

                            return (
                                <div
                                    key={key}
                                    className="space-y-4 rounded-xl border bg-card p-6"
                                >
                                    <h3
                                        className="text-sm leading-relaxed font-medium"
                                        dir="auto"
                                    >
                                        {AYAT_LABELS[key]}
                                    </h3>

                                    {jaliyCount > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-xs font-semibold tracking-wide text-destructive uppercase">
                                                Kesalahan Jaliy (Jelas)
                                            </p>
                                            <ul className="space-y-1">
                                                {ayat!.jaliy.map((error, i) => (
                                                    <li
                                                        key={i}
                                                        className="flex gap-2 text-sm text-foreground/80"
                                                    >
                                                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                                                        {error}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {khafiyCount > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-xs font-semibold tracking-wide text-amber-600 uppercase dark:text-amber-400">
                                                Kesalahan Khafiy (Tersembunyi)
                                            </p>
                                            <ul className="space-y-1">
                                                {ayat!.khafiy.map(
                                                    (error, i) => (
                                                        <li
                                                            key={i}
                                                            className="flex gap-2 text-sm text-foreground/80"
                                                        >
                                                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                                                            {error}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
