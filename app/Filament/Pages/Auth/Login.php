<?php

namespace App\Filament\Pages\Auth;

use Filament\Auth\Pages\Login as BaseLogin;
use Laravel\Socialite\Facades\Socialite;

class Login extends BaseLogin
{
    public function mount(): void
    {
        /** @var \Laravel\Socialite\Two\AbstractProvider $provider */
        $provider = Socialite::driver('keycloak');

        $this->redirect($provider->stateless()->redirect()->getTargetUrl(), navigate: false);
    }
}
