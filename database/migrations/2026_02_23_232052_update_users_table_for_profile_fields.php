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
        Schema::table('users', function (Blueprint $table) {
            $table->text('jenis_kelamin')->nullable();
            $table->text('nama_lengkap')->nullable();
            $table->text('nomor_wa')->nullable();
            $table->boolean('pernah_hits')->default(false);
            $table->string('keycloak_id')->nullable()->unique();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'jenis_kelamin',
                'nama_lengkap',
                'nomor_wa',
                'pernah_hits',
                'keycloak_id',
            ]);
        });
    }
};
