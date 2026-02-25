<?php

namespace App\Filament\Resources\Evaluations\Pages;

use App\Filament\Resources\Evaluations\EvaluationResource;
use App\Models\User;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Str;

class CreateEvaluation extends CreateRecord
{
    protected static string $resource = EvaluationResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['kode_unik'] = strtoupper(Str::random(8));

        $user = User::create([
            'nama_lengkap' => $data['nama_lengkap'],
            'name' => $data['nama_lengkap'],
        ]);

        $data['user_id'] = $user->id;

        unset($data['nama_lengkap']);

        return $data;
    }
}
