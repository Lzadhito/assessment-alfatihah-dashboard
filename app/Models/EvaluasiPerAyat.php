<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\AsArrayObject;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EvaluasiPerAyat extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'evaluasi_per_ayat';

    protected $primaryKey = 'uuid';

    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = [
        'ayat_1',
        'ayat_2',
        'ayat_3',
        'ayat_4',
        'ayat_5',
        'ayat_6',
        'ayat_7',
        'ayat_7_part_2',
        'pemeriksa',
        'kode_unik',
        'kegiatan',
        'user_id',
        'asal_halaqah',
        'created_at',
        'rekomendasi_program',
    ];

    protected function casts(): array
    {
        return [
            'ayat_1' => AsArrayObject::class,
            'ayat_2' => AsArrayObject::class,
            'ayat_3' => AsArrayObject::class,
            'ayat_4' => AsArrayObject::class,
            'ayat_5' => AsArrayObject::class,
            'ayat_6' => AsArrayObject::class,
            'ayat_7' => AsArrayObject::class,
            'ayat_7_part_2' => AsArrayObject::class,
            'created_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
