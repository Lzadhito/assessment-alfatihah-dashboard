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
import { Download, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { Radar } from 'react-chartjs-2';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';
import { EVALUATION_OPTION_KEYS, UNIQUE_CODE_LENGTH } from '@/constants';
import { generateFilename, generatePDF } from '@/lib/pdf-generator';
import { getToneColor } from '@/lib/scoring';
import { cn, snakeCaseToTitleCase } from '@/lib/utils';
import type { Evaluation } from '@/types/results';
import PDFDocument from '@/components/results/PDFDocument';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
);

type Props = {
    evaluation: Evaluation;
};

export default function Results({ evaluation }: Props) {
    const [chartBase64, setChartBase64] = useState<string>('');
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
                            const jaliyCount = ayatData?.jaliy?.length ?? 0;
                            const khafiyCount = ayatData?.khafiy?.length ?? 0;
                            const totalErrors = jaliyCount + khafiyCount;
                            const isClean = totalErrors === 0;

                            return (
                                <Card
                                    key={av}
                                    className="overflow-hidden border-0 shadow-sm"
                                >
                                    <CardHeader className="">
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
                                                            {jaliyCount} Jaliy
                                                        </span>
                                                    )}
                                                    {khafiyCount > 0 && (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                                            {khafiyCount} Khafiy
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </CardHeader>

                                    {!isClean && (
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

                                    {isClean && (
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
            <PDFDocument evaluation={evaluation} chartBase64={chartBase64} />
        </div>
    );
}
