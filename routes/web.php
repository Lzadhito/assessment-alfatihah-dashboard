<?php

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

require __DIR__.'/settings.php';
