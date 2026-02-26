import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

import { UNIQUE_CODE_LENGTH } from '@/constants';
import { snakeCaseToTitleCase } from '@/lib/utils';
import type { Evaluation } from '@/types/results';

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

type Props = {
    evaluation: Evaluation;
    chartBase64: string;
};

export default function PDFDocument({ evaluation, chartBase64 }: Props) {
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
