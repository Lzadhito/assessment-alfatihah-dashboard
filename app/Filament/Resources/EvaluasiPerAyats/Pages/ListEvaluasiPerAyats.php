<?php

namespace App\Filament\Resources\EvaluasiPerAyats\Pages;

use App\Filament\Resources\EvaluasiPerAyats\EvaluasiPerAyatResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListEvaluasiPerAyats extends ListRecords
{
    protected static string $resource = EvaluasiPerAyatResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
