<?php

use App\Models\User;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;

it('denies Keycloak login for users not in DB', function () {
    $keycloakId = 'not-in-db';
    Socialite::shouldReceive('driver')->with('keycloak')->andReturnSelf();
    Socialite::shouldReceive('stateless')->andReturnSelf();
    $mockSocialiteUser = new class {
        public function getId()
        {
            return 'not-in-db';
        }
        public function getName()
        {
            return 'Test User';
        }
        public function getNickname()
        {
            return 'testuser';
        }
        public function getEmail()
        {
            return 'test@example.com';
        }
    };
    Socialite::shouldReceive('user')->andReturn($mockSocialiteUser);

    $response = $this->get(route('auth.keycloak.callback'));
    $response->assertRedirect(route('filament.admin.auth.login'));
    $response->assertSessionHasErrors(['email']);
    $this->assertGuest();
});

it('allows Keycloak login for users in DB', function () {
    $user = User::factory()->create(['keycloak_id' => 'in-db']);
    Socialite::shouldReceive('driver')->with('keycloak')->andReturnSelf();
    Socialite::shouldReceive('stateless')->andReturnSelf();
    $mockSocialiteUser = new class($user) {
        private $user;
        public function __construct($user)
        {
            $this->user = $user;
        }
        public function getId()
        {
            return 'in-db';
        }
        public function getName()
        {
            return $this->user->name;
        }
        public function getNickname()
        {
            return $this->user->name;
        }
        public function getEmail()
        {
            return $this->user->email;
        }
    };
    Socialite::shouldReceive('user')->andReturn($mockSocialiteUser);

    $response = $this->get(route('auth.keycloak.callback'));
    $response->assertRedirect(filament()->getPanel('admin')->getUrl());
    $this->assertAuthenticatedAs($user);
});
