<?php

namespace App\Filament\Resources\Evaluations\Pages;

use App\Filament\Resources\Evaluations\EvaluationResource;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Str;

class CreateEvaluation extends CreateRecord
{
    protected static string $resource = EvaluationResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['kode_unik'] = strtoupper(Str::random(8));

        return $data;
    }
}
