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
    const [, setChartBase64] = useState<string>('');
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

    const handleDownloadPDF = async () => {
        try {
            const filename = generateFilename(
                evaluation.nama_lengkap,
                evaluation.created_at
                    ? new Date(evaluation.created_at)
                          .toISOString()
                          .split('T')[0]
                    : undefined,
            );
            await generatePDF('evaluation-content', {
                filename,
                scale: 2,
                useCORS: true,
                allowTaint: true,
            });
        } catch (error) {
            console.error('PDF generation failed:', error);
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
        <div>
            <Head title={pageTitle} />

            <section className="p-4 pb-0 lg:p-8 lg:pb-0">
                <div className="flex justify-end gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                aria-label="More actions"
                            >
                                <MoreVertical className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-1">
                            <DropdownMenuItem asChild>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start"
                                    onClick={handleDownloadPDF}
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    PDF
                                </Button>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </section>

            <main
                id="evaluation-content"
                className="container mx-auto space-y-8 p-4 lg:p-8"
            >
                {/* Header */}
                <header className="flex gap-4">
                    <img
                        className="h-22 w-22 rounded-lg"
                        src="/logo.jpg"
                        alt="Logo"
                    />
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight text-pretty">
                            Report Assessment Al-Fatihah
                        </h1>
                        <div className="text-sm text-gray-600">
                            Muhajir Project Tilawah
                        </div>
                    </div>
                </header>

                {/* Participant Info */}
                <Card className="mb-6">
                    <CardContent className="flex flex-col items-start justify-between lg:flex-row lg:items-center">
                        <div>
                            <p className="text-lg font-semibold">
                                {evaluation.nama_lengkap ||
                                    evaluation.kode_unik.slice(
                                        0,
                                        UNIQUE_CODE_LENGTH,
                                    ) ||
                                    '-'}
                            </p>
                            {evaluation.kegiatan && (
                                <h2 className="text-sm tracking-wide text-gray-500 uppercase">
                                    {evaluation.kegiatan}
                                </h2>
                            )}
                            {evaluation.pemeriksa && (
                                <h2 className="text-xs tracking-wide text-gray-500 uppercase">
                                    Diperiksa oleh: {evaluation.pemeriksa}
                                </h2>
                            )}
                        </div>
                        <p className="text-lg font-semibold">
                            {format(
                                evaluation.created_at
                                    ? new Date(evaluation.created_at)
                                    : new Date(),
                                'dd MMMM yyyy',
                                { locale: localeId },
                            )}
                        </p>
                    </CardContent>
                </Card>

                {/* Score Card + Radar Chart */}
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <Card
                        className={cn(
                            getToneColor(
                                evaluation.scores?.minScore?.label?.tone,
                            ),
                        )}
                    >
                        <CardContent>
                            <div className="mb-2 text-5xl font-bold">
                                {evaluation.scores?.minScore?.score} / 5
                            </div>
                            <div className="mb-4 text-sm">Status:</div>
                            <div className="text-lg font-semibold">
                                {evaluation.scores?.minScore?.label?.title}
                            </div>
                            {evaluation.scores?.minScore?.label
                                ?.description && (
                                <div className="mt-1 text-sm">
                                    {
                                        evaluation.scores.minScore.label
                                            .description
                                    }
                                </div>
                            )}
                            {evaluation.rekomendasi_program && (
                                <div className="mt-4 space-y-2 text-sm text-gray-500">
                                    Alhamdulillah, kamu direkomendasikan untuk
                                    mengikuti{' '}
                                    <strong>
                                        {evaluation.rekomendasi_program}
                                    </strong>
                                </div>
                            )}
                            <img
                                src="/qr_linktree.png"
                                alt="Muhajir Project Tilawah"
                                className="mx-auto mt-4 w-48"
                            />
                            <div className="mt-4 flex w-full items-center justify-center">
                                <a
                                    href="https://linktr.ee/Muhajirprojecttilawah"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button>Daftar Sekarang</Button>
                                </a>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="xl:col-span-2">
                        <CardContent className="min-h-[50vh] w-full">
                            <Radar data={chartData} options={chartOptions} />
                        </CardContent>
                    </Card>
                </section>

                {/* Per-Ayat Details */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {Object.keys(ayatEvaluations).map((av) => {
                        const ayatData =
                            ayatEvaluations[av as keyof typeof ayatEvaluations];
                        const isExpanded = expandedCategories.has(av);

                        return (
                            <Card key={av}>
                                <div
                                    className="cursor-pointer p-4 transition-colors hover:bg-gray-50"
                                    onClick={() => toggleCategory(av)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold">
                                                {snakeCaseToTitleCase(av)}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {isExpanded ? (
                                                <ChevronDown size={20} />
                                            ) : (
                                                <ChevronRight size={20} />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="border-t bg-gray-50 px-4 pb-4">
                                        <div className="pt-4">
                                            <h4 className="mb-3 text-sm font-medium text-gray-700">
                                                Khafiy
                                            </h4>
                                            <ul className="space-y-2">
                                                {ayatData?.khafiy?.length ? (
                                                    ayatData.khafiy.map(
                                                        (
                                                            khafiy: string,
                                                            index: number,
                                                        ) => (
                                                            <li
                                                                key={index}
                                                                className="flex items-start gap-2 text-sm text-gray-600"
                                                            >
                                                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-500" />
                                                                <span>
                                                                    {khafiy}
                                                                </span>
                                                            </li>
                                                        ),
                                                    )
                                                ) : (
                                                    <li className="text-sm text-gray-400">
                                                        -
                                                    </li>
                                                )}
                                            </ul>
                                        </div>

                                        <div className="pt-4">
                                            <h4 className="mb-3 text-sm font-medium text-gray-700">
                                                Jaliy
                                            </h4>
                                            <ul className="space-y-2">
                                                {ayatData?.jaliy?.length ? (
                                                    ayatData.jaliy.map(
                                                        (
                                                            jaliy: string,
                                                            index: number,
                                                        ) => (
                                                            <li
                                                                key={index}
                                                                className="flex items-start gap-2 text-sm text-gray-600"
                                                            >
                                                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-500" />
                                                                <span>
                                                                    {jaliy}
                                                                </span>
                                                            </li>
                                                        ),
                                                    )
                                                ) : (
                                                    <li className="text-sm text-gray-400">
                                                        -
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="mt-12 text-center text-sm text-gray-500">
                    © 2026 Muhajir Project Tilawah • Laporan ini bersifat
                    pendampingan belajar
                </div>
            </main>
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
