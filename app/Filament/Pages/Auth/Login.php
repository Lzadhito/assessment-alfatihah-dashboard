<?php

namespace App\Filament\Pages\Auth;

use Filament\Auth\Pages\Login as BaseLogin;
use Laravel\Socialite\Facades\Socialite;

class Login extends BaseLogin
{
    public function mount(): void
    {
        $this->redirect(Socialite::driver('keycloak')->stateless()->redirect()->getTargetUrl(), navigate: false);
    }
}
