<?php

use App\Models\Evaluation;
use App\Models\User;
use Illuminate\Support\Str;

it('creates user with legacy profile fields and keycloak id', function () {
    $user = User::factory()->create([
        'jenis_kelamin' => 'L',
        'nama_lengkap' => 'Ahmad Yusuf',
        'nomor_wa' => '08123456789',
        'pernah_hits' => true,
        'keycloak_id' => (string) Str::uuid(),
    ]);

    expect($user->id)->toBeString()->not->toBeEmpty();
    expect($user->pernah_hits)->toBeTrue();
    expect($user->nama_lengkap)->toBe('Ahmad Yusuf');

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'keycloak_id' => $user->keycloak_id,
        'nama_lengkap' => 'Ahmad Yusuf',
    ]);
});

it('stores evaluasi per ayat with json payloads', function () {
    $user = User::factory()->create();

    $payload = ['score' => 5, 'notes' => 'baik'];

    $evaluation = Evaluation::create([
        'user_id' => $user->id,
        'pemeriksa' => 'Ustadzah A',
        'kode_unik' => 'KDG-01',
        'kegiatan' => 'Tahsin',
        'asal_halaqah' => 'Halaqah 1',
        'rekomendasi_program' => 'Program lanjutan',
        'ayat_1' => $payload,
        'ayat_2' => $payload,
    ]);

    expect($evaluation->uuid)->toBeString()->not->toBeEmpty();
    expect($evaluation->ayat_1)->toMatchArray($payload);
    expect($evaluation->user)->not->toBeNull();
    expect($evaluation->user->id)->toBe($user->id);

    $this->assertDatabaseHas('evaluasi_per_ayat', [
        'uuid' => $evaluation->uuid,
        'user_id' => $user->uuid,
        'kode_unik' => 'KDG-01',
    ]);
});
