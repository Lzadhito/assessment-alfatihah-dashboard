import { Head } from '@inertiajs/react';
import {
    Chart as ChartJS,
    Filler,
    Legend,
    LineElement,
    PointElement,
    RadialLinearScale,
    Tooltip,
    type AnimationEvent,
} from 'chart.js';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import {
    ChevronDown,
    ChevronRight,
    Download,
    MoreVertical,
} from 'lucide-react';
import { useState } from 'react';
import { Radar } from 'react-chartjs-2';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { EVALUATION_OPTION_KEYS, UNIQUE_CODE_LENGTH } from '@/constants';
import { generateFilename, generatePDF } from '@/lib/pdf-generator';
import { getToneColor } from '@/lib/scoring';
import { cn, snakeCaseToTitleCase } from '@/lib/utils';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
);

type AyatErrors = {
    jaliy: string[];
    khafiy: string[];
};

type ScoreLabel = {
    title: string;
    description: string;
    tone: string;
};

type Scores = Record<string, number> & {
    minScore: {
        score: number;
        label: ScoreLabel;
    };
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
    scores: Scores;
};

type Props = {
    evaluation: Evaluation;
};

export default function Results({ evaluation }: Props) {
    const [chartBase64, setChartBase64] = useState<string>('');
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
        new Set(EVALUATION_OPTION_KEYS),
    );

    const toggleCategory = (category: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(category)) {
            newExpanded.delete(category);
        } else {
            newExpanded.add(category);
        }
        setExpandedCategories(newExpanded);
    };

    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    const handleDownloadPDF = async () => {
        if (isGeneratingPdf) return;
        setIsGeneratingPdf(true);
        try {
            const filename = generateFilename(
                evaluation.nama_lengkap,
                evaluation.created_at
                    ? new Date(evaluation.created_at)
                          .toISOString()
                          .split('T')[0]
                    : undefined,
            );
            await generatePDF('pdf-document', {
                filename,
                scale: 2,
                useCORS: true,
                allowTaint: true,
            });
        } catch (error) {
            console.error('PDF generation failed:', error);
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    const pageTitle = `${evaluation.nama_lengkap ?? 'Peserta'} - ${format(
        evaluation.created_at ? new Date(evaluation.created_at) : new Date(),
        'dd MMMM yyyy',
        { locale: localeId },
    )}`;

    const chartData = {
        labels: EVALUATION_OPTION_KEYS.map((ayat) =>
            snakeCaseToTitleCase(ayat),
        ),
        datasets: [
            {
                label: `Skor terendah peserta: ${evaluation.scores?.minScore?.score}/5`,
                data: EVALUATION_OPTION_KEYS.map(
                    (ayat) => (evaluation.scores?.[ayat] as number) ?? 0,
                ),
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 2,
                pointRadius: 1.5,
            },
            {
                label: 'Skor terendah yang tergolong aman: 3/5',
                data: EVALUATION_OPTION_KEYS.map(() => 3),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                borderDash: [5, 5],
                pointRadius: 0,
            },
        ],
    };

    const chartOptions = {
        animation: {
            onComplete(event: AnimationEvent) {
                setChartBase64(event.chart.toBase64Image());
            },
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                beginAtZero: true,
                max: 5,
                ticks: {
                    stepSize: 1,
                    callback: function (value: number | string) {
                        return Math.floor(Number(value));
                    },
                },
            },
        },
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
        },
    };

    const ayatEvaluations = {
        ayat_1: evaluation.ayat_1,
        ayat_2: evaluation.ayat_2,
        ayat_3: evaluation.ayat_3,
        ayat_4: evaluation.ayat_4,
        ayat_5: evaluation.ayat_5,
        ayat_6: evaluation.ayat_6,
        ayat_7: evaluation.ayat_7,
        ayat_7_part_2: evaluation.ayat_7_part_2,
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title={pageTitle} />

            {/* Sticky top bar */}
            <div className="sticky top-0 z-10 border-b bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm lg:px-8">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            className="h-8 w-8 rounded-md object-cover"
                            src="/logo.jpg"
                            alt="Logo"
                        />
                        <div>
                            <p className="text-sm leading-none font-semibold">
                                Report Assessment Al-Fatihah
                            </p>
                            <p className="mt-0.5 text-xs text-gray-500">
                                Muhajir Project Tilawah
                            </p>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                aria-label="More actions"
                                disabled={isGeneratingPdf}
                            >
                                {isGeneratingPdf ? (
                                    <Spinner className="mr-1.5 h-4 w-4" />
                                ) : (
                                    <Download className="mr-1.5 h-4 w-4" />
                                )}
                                {isGeneratingPdf ? 'Menyiapkan...' : 'Unduh'}
                                <MoreVertical className="ml-1 h-3.5 w-3.5 text-gray-400" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={handleDownloadPDF}
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Unduh PDF
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <main
                id="evaluation-content"
                className="container mx-auto space-y-6 px-4 py-6 lg:px-8 lg:py-8"
            >
                {/* Participant hero card */}
                <Card className="overflow-hidden border-0 shadow-md">
                    <div className="bg-gradient-to-r from-gray-900 to-gray-700 px-6 py-5 text-white">
                        <p className="text-xs font-medium tracking-widest text-gray-400 uppercase">
                            {evaluation.kegiatan ?? 'Assessment'}
                        </p>
                        <h1 className="mt-1 text-2xl font-bold tracking-tight">
                            {evaluation.nama_lengkap ||
                                evaluation.kode_unik.slice(
                                    0,
                                    UNIQUE_CODE_LENGTH,
                                ) ||
                                '-'}
                        </h1>
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-300">
                            {evaluation.pemeriksa && (
                                <span>
                                    Pemeriksa:{' '}
                                    <span className="font-medium text-white">
                                        {evaluation.pemeriksa}
                                    </span>
                                </span>
                            )}
                            <span>
                                {format(
                                    evaluation.created_at
                                        ? new Date(evaluation.created_at)
                                        : new Date(),
                                    'dd MMMM yyyy',
                                    { locale: localeId },
                                )}
                            </span>
                        </div>
                    </div>
                </Card>

                {/* Score Card + Radar Chart */}
                <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    {/* Score card */}
                    <Card
                        className={cn(
                            'flex flex-col overflow-hidden border-0 shadow-md',
                            getToneColor(
                                evaluation.scores?.minScore?.label?.tone,
                            ),
                        )}
                    >
                        <CardContent className="flex flex-1 flex-col gap-4 p-6">
                            <div>
                                <p className="text-xs font-semibold tracking-widest uppercase opacity-70">
                                    Skor Terendah
                                </p>
                                <div className="mt-1 flex items-end gap-1">
                                    <span className="text-6xl leading-none font-black">
                                        {evaluation.scores?.minScore?.score}
                                    </span>
                                    <span className="mb-1 text-2xl font-semibold opacity-50">
                                        / 5
                                    </span>
                                </div>
                            </div>

                            <div className="rounded-lg bg-black/5 px-4 py-3">
                                <p className="text-base font-bold">
                                    {evaluation.scores?.minScore?.label?.title}
                                </p>
                                {evaluation.scores?.minScore?.label
                                    ?.description && (
                                    <p className="mt-0.5 text-sm opacity-80">
                                        {
                                            evaluation.scores.minScore.label
                                                .description
                                        }
                                    </p>
                                )}
                            </div>

                            {evaluation.rekomendasi_program && (
                                <div className="rounded-lg bg-black/5 px-4 py-3 text-sm">
                                    <p className="font-medium opacity-70">
                                        Rekomendasi Program
                                    </p>
                                    <p className="mt-0.5 font-bold">
                                        {evaluation.rekomendasi_program}
                                    </p>
                                </div>
                            )}

                            <div className="mt-auto flex flex-col items-center gap-3 pt-2">
                                <img
                                    src="/qr_linktree.png"
                                    alt="Muhajir Project Tilawah"
                                    className="w-36 rounded-lg opacity-90"
                                />
                                <a
                                    href="https://linktr.ee/Muhajirprojecttilawah"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full"
                                >
                                    <Button className="w-full" size="sm">
                                        Daftar Sekarang
                                    </Button>
                                </a>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Radar chart */}
                    <Card className="border-0 shadow-md xl:col-span-2">
                        <CardContent className="p-6">
                            <p className="mb-4 text-sm font-semibold text-gray-700">
                                Grafik Skor per Ayat
                            </p>
                            <div className="h-[380px] w-full">
                                <Radar
                                    data={chartData}
                                    options={chartOptions}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Per-Ayat Details */}
                <div>
                    <h2 className="mb-3 text-base font-semibold text-gray-800">
                        Detail Kesalahan per Ayat
                    </h2>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {Object.keys(ayatEvaluations).map((av) => {
                            const ayatData =
                                ayatEvaluations[
                                    av as keyof typeof ayatEvaluations
                                ];
                            const isExpanded = expandedCategories.has(av);
                            const jaliyCount = ayatData?.jaliy?.length ?? 0;
                            const khafiyCount = ayatData?.khafiy?.length ?? 0;
                            const totalErrors = jaliyCount + khafiyCount;
                            const isClean = totalErrors === 0;

                            return (
                                <Card
                                    key={av}
                                    className="overflow-hidden border-0 shadow-sm"
                                >
                                    <button
                                        type="button"
                                        className="flex w-full cursor-pointer items-center justify-between p-4 text-left transition-colors hover:bg-gray-50"
                                        onClick={() => toggleCategory(av)}
                                    >
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">
                                                {snakeCaseToTitleCase(av)}
                                            </h3>
                                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                                                {isClean ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                                        Tidak ada kesalahan
                                                    </span>
                                                ) : (
                                                    <>
                                                        {jaliyCount > 0 && (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                                                                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                                                {jaliyCount}{' '}
                                                                Jaliy
                                                            </span>
                                                        )}
                                                        {khafiyCount > 0 && (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                                                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                                                {khafiyCount}{' '}
                                                                Khafiy
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <span className="ml-3 shrink-0 text-gray-400">
                                            {isExpanded ? (
                                                <ChevronDown size={18} />
                                            ) : (
                                                <ChevronRight size={18} />
                                            )}
                                        </span>
                                    </button>

                                    {isExpanded && !isClean && (
                                        <div className="divide-y border-t">
                                            {jaliyCount > 0 && (
                                                <div className="bg-red-50 px-4 py-3">
                                                    <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-red-600 uppercase">
                                                        <span className="h-2 w-2 rounded-full bg-red-500" />
                                                        Kesalahan Jaliy (Jelas)
                                                    </p>
                                                    <ul className="space-y-1.5">
                                                        {ayatData!.jaliy.map(
                                                            (
                                                                jaliy: string,
                                                                index: number,
                                                            ) => (
                                                                <li
                                                                    key={index}
                                                                    className="flex items-start gap-2 text-sm text-red-800"
                                                                >
                                                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                                                                    {jaliy}
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                            {khafiyCount > 0 && (
                                                <div className="bg-amber-50 px-4 py-3">
                                                    <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-amber-600 uppercase">
                                                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                                                        Kesalahan Khafiy
                                                        (Tersembunyi)
                                                    </p>
                                                    <ul className="space-y-1.5">
                                                        {ayatData!.khafiy.map(
                                                            (
                                                                khafiy: string,
                                                                index: number,
                                                            ) => (
                                                                <li
                                                                    key={index}
                                                                    className="flex items-start gap-2 text-sm text-amber-800"
                                                                >
                                                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                                                                    {khafiy}
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {isExpanded && isClean && (
                                        <div className="border-t bg-green-50 px-4 py-3 text-sm text-green-700">
                                            Tidak ada kesalahan yang tercatat
                                            pada ayat ini.
                                        </div>
                                    )}
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t pt-6 text-center text-xs text-gray-400">
                    © 2026 Muhajir Project Tilawah • Laporan ini bersifat
                    pendampingan belajar
                </div>
            </main>

            {/* Off-screen PDF document – always rendered for html2canvas */}
            <PdfDocument evaluation={evaluation} chartBase64={chartBase64} />
        </div>
    );
}

// ---------------------------------------------------------------------------
// PDF Document – fixed off-screen, captured by html2canvas
// ---------------------------------------------------------------------------

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

const TONE_BG: Record<string, string> = {
    green: '#f0fdf4',
    blue: '#eff6ff',
    amber: '#fffbeb',
    orange: '#fff7ed',
    red: '#fef2f2',
};

const TONE_BORDER: Record<string, string> = {
    green: '#86efac',
    blue: '#93c5fd',
    amber: '#fcd34d',
    orange: '#fdba74',
    red: '#fca5a5',
};

const TONE_TEXT: Record<string, string> = {
    green: '#14532d',
    blue: '#1e3a5f',
    amber: '#78350f',
    orange: '#7c2d12',
    red: '#7f1d1d',
};

function PdfDocument({
    evaluation,
    chartBase64,
}: {
    evaluation: Evaluation;
    chartBase64: string;
}) {
    const tone = evaluation.scores?.minScore?.label?.tone ?? '';
    const scoreBg = TONE_BG[tone] ?? '#f9fafb';
    const scoreBorder = TONE_BORDER[tone] ?? '#e5e7eb';
    const scoreText = TONE_TEXT[tone] ?? '#111827';

    const ayatEvaluations = {
        ayat_1: evaluation.ayat_1,
        ayat_2: evaluation.ayat_2,
        ayat_3: evaluation.ayat_3,
        ayat_4: evaluation.ayat_4,
        ayat_5: evaluation.ayat_5,
        ayat_6: evaluation.ayat_6,
        ayat_7: evaluation.ayat_7,
        ayat_7_part_2: evaluation.ayat_7_part_2,
    };

    return (
        /* Fixed off-screen so it's in the DOM but invisible to the user */
        <div
            style={{
                position: 'fixed',
                left: '-9999px',
                top: 0,
                width: '794px',
                backgroundColor: '#ffffff',
                fontFamily:
                    'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
            }}
        >
            <div
                id="pdf-document"
                style={{
                    width: '794px',
                    backgroundColor: '#ffffff',
                    padding: '48px',
                }}
            >
                {/* ── Header ── */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '32px',
                    }}
                >
                    <img
                        src="/logo.jpg"
                        alt="Logo"
                        style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '10px',
                            objectFit: 'cover',
                        }}
                    />
                    <div>
                        <div
                            style={{
                                fontSize: '22px',
                                fontWeight: 700,
                                color: '#111827',
                                lineHeight: 1.2,
                            }}
                        >
                            Report Assessment Al-Fatihah
                        </div>
                        <div
                            style={{
                                fontSize: '13px',
                                color: '#6b7280',
                                marginTop: '2px',
                            }}
                        >
                            Muhajir Project Tilawah
                        </div>
                    </div>
                    <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                            {format(
                                evaluation.created_at
                                    ? new Date(evaluation.created_at)
                                    : new Date(),
                                'dd MMMM yyyy',
                                { locale: localeId },
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Participant info ── */}
                <div
                    style={{
                        background:
                            'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
                        borderRadius: '12px',
                        padding: '24px 28px',
                        color: '#ffffff',
                        marginBottom: '24px',
                    }}
                >
                    <div
                        style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: '#9ca3af',
                            marginBottom: '6px',
                        }}
                    >
                        {evaluation.kegiatan ?? 'Assessment'}
                    </div>
                    <div
                        style={{
                            fontSize: '24px',
                            fontWeight: 700,
                            letterSpacing: '-0.5px',
                        }}
                    >
                        {evaluation.nama_lengkap ||
                            evaluation.kode_unik.slice(0, UNIQUE_CODE_LENGTH) ||
                            '-'}
                    </div>
                    <div
                        style={{
                            marginTop: '10px',
                            display: 'flex',
                            gap: '20px',
                            fontSize: '13px',
                            color: '#d1d5db',
                        }}
                    >
                        {evaluation.pemeriksa && (
                            <span>
                                Pemeriksa:{' '}
                                <strong style={{ color: '#fff' }}>
                                    {evaluation.pemeriksa}
                                </strong>
                            </span>
                        )}
                        {evaluation.asal_halaqah && (
                            <span>
                                Halaqah:{' '}
                                <strong style={{ color: '#fff' }}>
                                    {evaluation.asal_halaqah}
                                </strong>
                            </span>
                        )}
                    </div>
                </div>

                {/* ── Score + Chart row ── */}
                <div
                    style={{
                        display: 'flex',
                        gap: '20px',
                        marginBottom: '24px',
                        alignItems: 'stretch',
                    }}
                >
                    {/* Score card */}
                    <div
                        style={{
                            width: '220px',
                            flexShrink: 0,
                            border: `1.5px solid ${scoreBorder}`,
                            borderRadius: '12px',
                            backgroundColor: scoreBg,
                            padding: '24px 20px',
                            color: scoreText,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                        }}
                    >
                        <div>
                            <div
                                style={{
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                    opacity: 0.65,
                                }}
                            >
                                Skor Terendah
                            </div>
                            <div
                                style={{
                                    fontSize: '56px',
                                    fontWeight: 900,
                                    lineHeight: 1,
                                    marginTop: '4px',
                                }}
                            >
                                {evaluation.scores?.minScore?.score}
                                <span
                                    style={{
                                        fontSize: '28px',
                                        fontWeight: 500,
                                        opacity: 0.45,
                                    }}
                                >
                                    /5
                                </span>
                            </div>
                        </div>

                        <div
                            style={{
                                borderRadius: '8px',
                                backgroundColor: 'rgba(0,0,0,0.06)',
                                padding: '12px',
                            }}
                        >
                            <div style={{ fontWeight: 700, fontSize: '15px' }}>
                                {evaluation.scores?.minScore?.label?.title}
                            </div>
                            {evaluation.scores?.minScore?.label
                                ?.description && (
                                <div
                                    style={{
                                        fontSize: '12px',
                                        marginTop: '4px',
                                        opacity: 0.8,
                                    }}
                                >
                                    {
                                        evaluation.scores.minScore.label
                                            .description
                                    }
                                </div>
                            )}
                        </div>

                        {evaluation.rekomendasi_program && (
                            <div
                                style={{
                                    borderRadius: '8px',
                                    backgroundColor: 'rgba(0,0,0,0.06)',
                                    padding: '12px',
                                    fontSize: '12px',
                                }}
                            >
                                <div
                                    style={{
                                        opacity: 0.65,
                                        marginBottom: '2px',
                                    }}
                                >
                                    Rekomendasi Program
                                </div>
                                <div style={{ fontWeight: 700 }}>
                                    {evaluation.rekomendasi_program}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Chart */}
                    <div
                        style={{
                            flex: 1,
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            backgroundColor: '#fafafa',
                            padding: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <div
                            style={{
                                fontSize: '11px',
                                fontWeight: 600,
                                color: '#6b7280',
                                letterSpacing: '0.06em',
                                textTransform: 'uppercase',
                                marginBottom: '8px',
                            }}
                        >
                            Grafik Skor per Ayat
                        </div>
                        {chartBase64 ? (
                            <img
                                src={chartBase64}
                                alt="Radar chart"
                                style={{
                                    width: '100%',
                                    height: '300px',
                                    objectFit: 'contain',
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#9ca3af',
                                    fontSize: '13px',
                                }}
                            >
                                Chart tidak tersedia
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Ayat errors ── */}
                <div>
                    <div
                        style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#6b7280',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            marginBottom: '12px',
                        }}
                    >
                        Detail Kesalahan per Ayat
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '12px',
                        }}
                    >
                        {Object.keys(ayatEvaluations).map((av) => {
                            const ayatData =
                                ayatEvaluations[
                                    av as keyof typeof ayatEvaluations
                                ];
                            const jaliyCount = ayatData?.jaliy?.length ?? 0;
                            const khafiyCount = ayatData?.khafiy?.length ?? 0;
                            const isClean =
                                jaliyCount === 0 && khafiyCount === 0;

                            return (
                                <div
                                    key={av}
                                    style={{
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '10px',
                                        overflow: 'hidden',
                                        backgroundColor: '#ffffff',
                                    }}
                                >
                                    {/* Card header */}
                                    <div
                                        style={{
                                            padding: '10px 14px',
                                            borderBottom: '1px solid #f3f4f6',
                                            backgroundColor: '#f9fafb',
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: '12px',
                                                fontWeight: 700,
                                                color: '#111827',
                                            }}
                                        >
                                            {snakeCaseToTitleCase(av)}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: '11px',
                                                color: '#6b7280',
                                                marginTop: '2px',
                                                direction: 'rtl',
                                                textAlign: 'right',
                                            }}
                                        >
                                            {AYAT_LABELS[av]}
                                        </div>
                                    </div>

                                    {isClean ? (
                                        <div
                                            style={{
                                                padding: '8px 14px',
                                                fontSize: '11px',
                                                color: '#16a34a',
                                                backgroundColor: '#f0fdf4',
                                            }}
                                        >
                                            ✓ Tidak ada kesalahan
                                        </div>
                                    ) : (
                                        <div>
                                            {jaliyCount > 0 && (
                                                <div
                                                    style={{
                                                        padding: '8px 14px',
                                                        backgroundColor:
                                                            '#fef2f2',
                                                        borderBottom:
                                                            khafiyCount > 0
                                                                ? '1px solid #fecaca'
                                                                : undefined,
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            fontSize: '10px',
                                                            fontWeight: 700,
                                                            textTransform:
                                                                'uppercase',
                                                            letterSpacing:
                                                                '0.06em',
                                                            color: '#dc2626',
                                                            marginBottom: '4px',
                                                        }}
                                                    >
                                                        Jaliy ({jaliyCount})
                                                    </div>
                                                    <ul
                                                        style={{
                                                            margin: 0,
                                                            padding: 0,
                                                            listStyle: 'none',
                                                        }}
                                                    >
                                                        {ayatData!.jaliy.map(
                                                            (e, i) => (
                                                                <li
                                                                    key={i}
                                                                    style={{
                                                                        fontSize:
                                                                            '11px',
                                                                        color: '#991b1b',
                                                                        display:
                                                                            'flex',
                                                                        alignItems:
                                                                            'flex-start',
                                                                        gap: '6px',
                                                                        marginBottom:
                                                                            '2px',
                                                                    }}
                                                                >
                                                                    <span
                                                                        style={{
                                                                            marginTop:
                                                                                '4px',
                                                                            width: '5px',
                                                                            height: '5px',
                                                                            borderRadius:
                                                                                '50%',
                                                                            backgroundColor:
                                                                                '#ef4444',
                                                                            flexShrink: 0,
                                                                            display:
                                                                                'inline-block',
                                                                        }}
                                                                    />
                                                                    {e}
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                            {khafiyCount > 0 && (
                                                <div
                                                    style={{
                                                        padding: '8px 14px',
                                                        backgroundColor:
                                                            '#fffbeb',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            fontSize: '10px',
                                                            fontWeight: 700,
                                                            textTransform:
                                                                'uppercase',
                                                            letterSpacing:
                                                                '0.06em',
                                                            color: '#d97706',
                                                            marginBottom: '4px',
                                                        }}
                                                    >
                                                        Khafiy ({khafiyCount})
                                                    </div>
                                                    <ul
                                                        style={{
                                                            margin: 0,
                                                            padding: 0,
                                                            listStyle: 'none',
                                                        }}
                                                    >
                                                        {ayatData!.khafiy.map(
                                                            (e, i) => (
                                                                <li
                                                                    key={i}
                                                                    style={{
                                                                        fontSize:
                                                                            '11px',
                                                                        color: '#92400e',
                                                                        display:
                                                                            'flex',
                                                                        alignItems:
                                                                            'flex-start',
                                                                        gap: '6px',
                                                                        marginBottom:
                                                                            '2px',
                                                                    }}
                                                                >
                                                                    <span
                                                                        style={{
                                                                            marginTop:
                                                                                '4px',
                                                                            width: '5px',
                                                                            height: '5px',
                                                                            borderRadius:
                                                                                '50%',
                                                                            backgroundColor:
                                                                                '#f59e0b',
                                                                            flexShrink: 0,
                                                                            display:
                                                                                'inline-block',
                                                                        }}
                                                                    />
                                                                    {e}
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── Footer ── */}
                <div
                    style={{
                        marginTop: '40px',
                        borderTop: '1px solid #e5e7eb',
                        paddingTop: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                        © 2026 Muhajir Project Tilawah • Laporan pendampingan
                        belajar
                    </div>
                    <img
                        src="/qr_linktree.png"
                        alt="QR"
                        style={{
                            width: '52px',
                            height: '52px',
                            borderRadius: '6px',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export function ResultsLoading() {
    return (
        <div>
            <section className="p-4 pb-0 lg:p-8 lg:pb-0">
                <div className="flex justify-end gap-2">
                    <Skeleton className="h-10 w-10" />
                </div>
            </section>
            <main className="container mx-auto space-y-8 p-4 lg:p-8">
                <header className="flex gap-4">
                    <Skeleton className="h-22 w-22 rounded-lg" />
                    <div className="flex-1">
                        <Skeleton className="mb-2 h-9 w-96" />
                        <Skeleton className="h-5 w-48" />
                    </div>
                </header>

                <Card className="mb-6">
                    <CardContent className="flex items-start justify-between">
                        <div className="flex-1">
                            <Skeleton className="mb-2 h-7 w-48" />
                            <Skeleton className="h-5 w-32" />
                        </div>
                        <Skeleton className="h-7 w-32" />
                    </CardContent>
                </Card>

                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <Card>
                        <CardContent>
                            <Skeleton className="mb-2 h-16 w-24" />
                            <Skeleton className="mb-4 h-5 w-16" />
                            <Skeleton className="mb-2 h-7 w-full" />
                            <Skeleton className="mb-4 h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                        </CardContent>
                    </Card>
                    <Card className="xl:col-span-2">
                        <CardContent className="flex min-h-[50vh] w-full items-center justify-center">
                            <Skeleton className="h-96 w-96 rounded-full" />
                        </CardContent>
                    </Card>
                </section>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <Card key={index}>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <Skeleton className="mb-2 h-7 w-40" />
                                        <Skeleton className="h-5 w-full" />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-5 w-5" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
