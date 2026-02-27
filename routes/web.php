<?php

use App\Http\Controllers\Auth\KeycloakController;
use App\Http\Controllers\EvaluationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [EvaluationController::class, 'index'])->name('home');
Route::post('/lookup', [EvaluationController::class, 'lookup'])->name('evaluation.lookup');
Route::post('/evaluation/{evaluation}/profile', [EvaluationController::class, 'updateProfile'])->name('evaluation.profile');
Route::get('/results/{evaluation}', [EvaluationController::class, 'results'])->name('results');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::prefix('auth/keycloak')->name('auth.keycloak.')->group(function () {
    Route::get('redirect', [KeycloakController::class, 'redirect'])->name('redirect');
    Route::get('callback', [KeycloakController::class, 'callback'])->name('callback');
    Route::get('logout', [KeycloakController::class, 'logout'])->name('logout');
});


require __DIR__ . '/settings.php';
