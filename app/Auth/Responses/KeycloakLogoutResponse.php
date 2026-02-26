<?php

namespace App\Auth\Responses;

use Filament\Auth\Http\Responses\Contracts\LogoutResponse as LogoutResponseContract;
use Illuminate\Http\RedirectResponse;

class KeycloakLogoutResponse implements LogoutResponseContract
{
    public function toResponse($request): RedirectResponse
    {
        $keycloakLogoutUrl = sprintf(
            '%s/realms/%s/protocol/openid-connect/logout?post_logout_redirect_uri=%s&client_id=%s',
            rtrim(config('services.keycloak.base_url'), '/'),
            config('services.keycloak.realms'),
            urlencode(url('/')),
            config('services.keycloak.client_id'),
        );

        return redirect()->to($keycloakLogoutUrl);
    }
}
