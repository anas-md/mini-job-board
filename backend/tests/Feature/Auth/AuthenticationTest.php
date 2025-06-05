<?php

use App\Models\User;

test('users can authenticate using the login screen', function () {
    $user = User::factory()->create();

    $response = $this->postJson('/api/auth/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertOk()
             ->assertJsonStructure([
                 'message',
                 'data' => [
                     'user' => ['id', 'name', 'email', 'role'],
                     'token'
                 ]
             ]);
});

test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create();

    $response = $this->postJson('/api/auth/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $response->assertStatus(422)
             ->assertJsonValidationErrors(['email']);
});

test('users can logout', function () {
    $user = User::factory()->create();
    $token = $user->createToken('test-token')->plainTextToken;

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
    ])->postJson('/api/auth/logout');

    $response->assertOk()
             ->assertJson(['message' => 'Logged out successfully']);
});
