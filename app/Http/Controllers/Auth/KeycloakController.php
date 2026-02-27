<?php

namespace App\Http\Controllers\Auth;

use App\Auth\Responses\KeycloakLogoutResponse;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;

class KeycloakController extends Controller
{
    /**
     * Redirect the user to the Keycloak authentication page.
     */
    public function redirect(): \Symfony\Component\HttpFoundation\RedirectResponse|\Illuminate\Http\RedirectResponse
    {
        return Socialite::driver('keycloak')->stateless()->redirect();
    }

    /**
     * Handle the Keycloak callback and authenticate the user.
     */
    public function callback(Request $request): \Illuminate\Http\RedirectResponse
    {
        if ($request->has('error')) {
            return redirect()->route('filament.admin.auth.login')
                ->withErrors(['email' => __('Keycloak authentication failed: :error', ['error' => $request->get('error_description', $request->get('error'))])]);
        }

        $socialiteUser = Socialite::driver('keycloak')->stateless()->user();

        $user = User::query()
            ->where('email', $socialiteUser->getEmail())
            ->first();

        if (! $user) {
            Inertia::flash('error', 'Akun dengan email tersebut tidak ditemukan. Silakan hubungi admin untuk bantuan');
            return redirect('/');
        }

        // Update keycloak_id if not set
        if (! $user->keycloak_id) {
            $user->keycloak_id = $socialiteUser->getId();
            $user->save();
        }

        Auth::login($user, remember: true);

        return redirect()->intended(filament()->getPanel('admin')->getUrl());
    }

    public function logout(Request $request)
    {
        return (new KeycloakLogoutResponse())->toResponse($request);
    }
}
