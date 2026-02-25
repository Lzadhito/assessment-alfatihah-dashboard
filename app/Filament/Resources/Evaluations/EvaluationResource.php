<?php

namespace App\Filament\Resources\Evaluations;

use App\Filament\Resources\Evaluations\Pages\CreateEvaluation;
use App\Filament\Resources\Evaluations\Pages\ListEvaluations;
use App\Filament\Resources\Evaluations\Schemas\EvaluationSchema;
use App\Filament\Resources\Evaluations\Tables\EvaluationsTable;
use App\Models\Evaluation;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class EvaluationResource extends Resource
{
    protected static ?string $model = Evaluation::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $navigationLabel = 'Evaluasi per Ayat';

    protected static ?string $modelLabel = 'Evaluasi per Ayat';

    protected static ?string $pluralModelLabel = 'Evaluasi per Ayat';

    public static function form(Schema $schema): Schema
    {
        return EvaluationSchema::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return EvaluationsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListEvaluations::route('/'),
            'create' => CreateEvaluation::route('/create'),
        ];
    }
}
