<?php

test('new users can register', function () {
    $response = $this->postJson('/api/auth/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'role' => 'applicant',
    ]);

    $response->assertCreated()
             ->assertJsonStructure([
                 'message',
                 'data' => [
                     'user' => ['id', 'name', 'email', 'role'],
                     'token'
                 ]
             ]);
    
    $this->assertDatabaseHas('users', [
        'email' => 'test@example.com',
        'role' => 'applicant'
    ]);
});
