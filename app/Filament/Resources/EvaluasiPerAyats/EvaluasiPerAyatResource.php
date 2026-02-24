<?php

namespace App\Filament\Resources\EvaluasiPerAyats;

use App\Filament\Resources\EvaluasiPerAyats\Pages\ListEvaluasiPerAyats;
use App\Filament\Resources\EvaluasiPerAyats\Tables\EvaluasiPerAyatsTable;
use App\Models\EvaluasiPerAyat;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class EvaluasiPerAyatResource extends Resource
{
    protected static ?string $model = EvaluasiPerAyat::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $navigationLabel = 'Evaluasi per Ayat';

    protected static ?string $modelLabel = 'Evaluasi per Ayat';

    protected static ?string $pluralModelLabel = 'Evaluasi per Ayat';

    public static function table(Table $table): Table
    {
        return EvaluasiPerAyatsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListEvaluasiPerAyats::route('/'),
        ];
    }
}
