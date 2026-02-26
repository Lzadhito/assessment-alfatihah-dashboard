<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
            ->firstOrCreate(
                ['keycloak_id' => $socialiteUser->getId()],
                [
                    'name' => $socialiteUser->getNickname() ?? $socialiteUser->getName(),
                    'nama_lengkap' => $socialiteUser->getName(),
                    'email' => $socialiteUser->getEmail(),
                    'email_verified_at' => now(),
                ]
            );

        if (! $user->wasRecentlyCreated) {
            $user->update([
                'nama_lengkap' => $socialiteUser->getName() ?? $user->nama_lengkap,
                'email' => $socialiteUser->getEmail() ?? $user->email,
            ]);
        }

        Auth::login($user, remember: true);

        return redirect()->intended(filament()->getPanel('admin')->getUrl());
    }
}
