<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('evaluasi_per_ayat', function (Blueprint $table) {
            $table->uuid('uuid')->primary();
            $table->jsonb('ayat_1')->nullable();
            $table->jsonb('ayat_2')->nullable();
            $table->jsonb('ayat_3')->nullable();
            $table->jsonb('ayat_4')->nullable();
            $table->jsonb('ayat_5')->nullable();
            $table->jsonb('ayat_6')->nullable();
            $table->jsonb('ayat_7')->nullable();
            $table->jsonb('ayat_7_part_2')->nullable();
            $table->text('pemeriksa')->nullable();
            $table->text('kode_unik')->nullable();
            $table->text('kegiatan')->nullable();
            $table->foreignUuid('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->text('asal_halaqah')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->text('rekomendasi_program')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evaluasi_per_ayat');
    }
};
