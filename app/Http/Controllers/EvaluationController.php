<?php

namespace App\Http\Controllers;

use App\Models\Evaluation;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EvaluationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('home');
    }

    public function lookup(Request $request): RedirectResponse|Response
    {
        $request->validate([
            'kode_unik' => ['required', 'string'],
        ]);

        $evaluation = Evaluation::query()
            ->with('user')
            ->whereRaw('kode_unik ILIKE ?', [trim($request->string('kode_unik')) . '%'])
            ->first();

        if (! $evaluation) {
            return back()->withErrors(['kode_unik' => 'Data tidak ditemukan.']);
        }

        if ($evaluation->user?->nama_lengkap) {
            return redirect()->route('results', $evaluation->uuid);
        }

        return Inertia::render('home', [
            'evaluation' => [
                'id' => $evaluation->uuid,
                'kode_unik' => $evaluation->kode_unik,
            ],
        ]);
    }

    public function updateProfile(Request $request, Evaluation $evaluation): RedirectResponse
    {
        $request->validate([
            'nama_lengkap' => ['required', 'string', 'max:255'],
        ]);

        if ($evaluation->user) {
            $evaluation->user->update(['nama_lengkap' => $request->string('nama_lengkap')]);
        } else {
            $user = User::create([
                'nama_lengkap' => $request->string('nama_lengkap'),
                'name' => $request->string('nama_lengkap'),
            ]);
            $evaluation->update(['user_id' => $user->id]);
        }

        return redirect()->route('results', $evaluation->uuid);
    }

    public function results(Evaluation $evaluation): Response
    {
        $evaluation->load('user');

        return Inertia::render('results', [
            'evaluation' => [
                'id' => $evaluation->uuid,
                'kode_unik' => $evaluation->kode_unik,
                'nama_lengkap' => $evaluation->user?->nama_lengkap,
                'pemeriksa' => $evaluation->pemeriksa,
                'kegiatan' => $evaluation->kegiatan,
                'asal_halaqah' => $evaluation->asal_halaqah,
                'rekomendasi_program' => $evaluation->rekomendasi_program,
                'created_at' => $evaluation->created_at,
                'ayat_1' => $evaluation->ayat_1,
                'ayat_2' => $evaluation->ayat_2,
                'ayat_3' => $evaluation->ayat_3,
                'ayat_4' => $evaluation->ayat_4,
                'ayat_5' => $evaluation->ayat_5,
                'ayat_6' => $evaluation->ayat_6,
                'ayat_7' => $evaluation->ayat_7,
                'ayat_7_part_2' => $evaluation->ayat_7_part_2,
                'scores' => $this->computeScores($evaluation),
            ],
        ]);
    }

    /**
     * Compute per-ayat scores and the overall minimum score with its label.
     *
     * @return array<string, mixed>
     */
    private function computeScores(Evaluation $evaluation): array
    {
        $ayatKeys = ['ayat_1', 'ayat_2', 'ayat_3', 'ayat_4', 'ayat_5', 'ayat_6', 'ayat_7', 'ayat_7_part_2'];

        $scores = [];

        foreach ($ayatKeys as $key) {
            $ayat = $evaluation->$key;

            if (! $ayat) {
                $scores[$key] = 5;

                continue;
            }

            $totalErrors = count($ayat['jaliy'] ?? []) + count($ayat['khafiy'] ?? []);

            $scores[$key] = match (true) {
                $totalErrors === 0 => 5,
                $totalErrors === 1 => 4,
                $totalErrors === 2 => 3,
                $totalErrors === 3 => 2,
                default => 1,
            };
        }

        $minScore = min($scores);

        $scores['minScore'] = [
            'score' => $minScore,
            'label' => $this->getScoreLabel($minScore),
        ];

        return $scores;
    }

    /**
     * Return a label array for a given score.
     *
     * @return array{title: string, description: string, tone: string}
     */
    private function getScoreLabel(int $score): array
    {
        return match ($score) {
            5 => ['title' => 'Sangat Baik', 'description' => 'Tidak ada kesalahan yang terdeteksi.', 'tone' => 'green'],
            4 => ['title' => 'Baik', 'description' => 'Hanya sedikit kesalahan minor.', 'tone' => 'blue'],
            3 => ['title' => 'Cukup', 'description' => 'Terdapat beberapa kesalahan yang perlu diperbaiki.', 'tone' => 'amber'],
            2 => ['title' => 'Perlu Perbaikan', 'description' => 'Terdapat cukup banyak kesalahan yang signifikan.', 'tone' => 'orange'],
            default => ['title' => 'Kritis', 'description' => 'Terdapat banyak kesalahan yang perlu segera diperbaiki.', 'tone' => 'red'],
        };
    }
}
