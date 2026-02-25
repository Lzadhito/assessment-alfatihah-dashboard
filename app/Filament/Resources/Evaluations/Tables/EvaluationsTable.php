<?php

namespace App\Filament\Resources\Evaluations\Tables;

use App\Models\Evaluation;
use Filament\Forms\Components\TextInput;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class EvaluationsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.nama_lengkap')
                    ->label('Nama Peserta')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('kode_unik')
                    ->label('Kode Unik')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('pemeriksa')
                    ->label('Pemeriksa')
                    ->searchable(),
                TextColumn::make('kegiatan')
                    ->label('Kegiatan'),
                TextColumn::make('asal_halaqah')
                    ->label('Asal Halaqah')
                    ->toggleable(),
                TextColumn::make('rekomendasi_program')
                    ->label('Rekomendasi Program')
                    ->wrap()
                    ->toggleable(),
                TextColumn::make('created_at')
                    ->label('Tanggal')
                    ->dateTime('d M Y, H:i')
                    ->sortable(),
            ])
            ->filters([
                Filter::make('nama_lengkap')
                    ->label('Cari Nama Peserta')
                    ->schema([
                        TextInput::make('nama_lengkap')
                            ->label('Nama Peserta')
                            ->placeholder('Ketik nama peserta...'),
                    ])
                    ->modifyQueryUsing(function (Builder $query, array $data): Builder {
                        return $query->when(
                            filled($data['nama_lengkap']),
                            fn (Builder $q) => $q->whereHas(
                                'user',
                                fn (Builder $u) => $u->where('nama_lengkap', 'like', "%{$data['nama_lengkap']}%"),
                            ),
                        );
                    })
                    ->indicateUsing(function (array $data): ?string {
                        if (filled($data['nama_lengkap'])) {
                            return 'Nama: '.$data['nama_lengkap'];
                        }

                        return null;
                    }),

                SelectFilter::make('pemeriksa')
                    ->label('Pemeriksa')
                    ->options(
                        fn () => Evaluation::query()
                            ->whereNotNull('pemeriksa')
                            ->distinct()
                            ->orderBy('pemeriksa')
                            ->pluck('pemeriksa', 'pemeriksa')
                            ->toArray(),
                    )
                    ->searchable(),

                SelectFilter::make('kegiatan')
                    ->label('Kegiatan')
                    ->options(
                        fn () => Evaluation::query()
                            ->whereNotNull('kegiatan')
                            ->distinct()
                            ->orderBy('kegiatan')
                            ->pluck('kegiatan', 'kegiatan')
                            ->toArray(),
                    ),

                Filter::make('kode_unik')
                    ->label('Cari Kode Unik')
                    ->schema([
                        TextInput::make('kode_unik')
                            ->label('Kode Unik')
                            ->placeholder('Ketik kode unik...'),
                    ])
                    ->modifyQueryUsing(function (Builder $query, array $data): Builder {
                        return $query->when(
                            filled($data['kode_unik']),
                            fn (Builder $q) => $q->where('kode_unik', 'like', "%{$data['kode_unik']}%"),
                        );
                    })
                    ->indicateUsing(function (array $data): ?string {
                        if (filled($data['kode_unik'])) {
                            return 'Kode Unik: '.$data['kode_unik'];
                        }

                        return null;
                    }),
            ])
            ->filtersLayout(\Filament\Tables\Enums\FiltersLayout::AboveContent)
            ->defaultSort('created_at', 'desc');
    }
}
