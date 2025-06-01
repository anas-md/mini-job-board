<?php

declare(strict_types=1);

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    public function test_user_can_register_as_applicant(): void
    {
        $password = $this->faker->password(8);
        $data = [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => $password,
            'password_confirmation' => $password,
            'role' => 'applicant',
        ];

        $response = $this->postJson('/api/register', $data);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'access_token',
                'token_type',
                'user' => [
                    'id',
                    'name',
                    'email',
                    'role',
                    'created_at',
                    'updated_at',
                ],
            ])
            ->assertJson([
                'token_type' => 'Bearer',
                'user' => [
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'role' => 'applicant',
                ]
            ]);

        $this->assertDatabaseHas('users', [
            'email' => $data['email'],
            'name' => $data['name'],
            'role' => 'applicant',
        ]);
    }

    public function test_user_can_register_as_employer(): void
    {
        $password = $this->faker->password(8);
        $data = [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => $password,
            'password_confirmation' => $password,
            'role' => 'employer',
        ];

        $response = $this->postJson('/api/register', $data);

        $response->assertStatus(201)
            ->assertJsonPath('user.role', 'employer');

        $this->assertDatabaseHas('users', [
            'email' => $data['email'],
            'role' => 'employer',
        ]);
    }

    public function test_registration_requires_all_fields(): void
    {
        $response = $this->postJson('/api/register', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'password', 'role']);
    }

    public function test_registration_requires_valid_email(): void
    {
        $password = $this->faker->password(8);
        $data = [
            'name' => $this->faker->name(),
            'email' => 'not-an-email',
            'password' => $password,
            'password_confirmation' => $password,
            'role' => 'applicant',
        ];
        $response = $this->postJson('/api/register', $data);
        $response->assertStatus(422)->assertJsonValidationErrors(['email']);
    }

    public function test_registration_requires_password_confirmation(): void
    {
        $data = [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => 'password123',
            'role' => 'applicant',
        ];
        $response = $this->postJson('/api/register', $data);
        $response->assertStatus(422)->assertJsonValidationErrors(['password']);
    }

    public function test_registration_password_confirmation_must_match(): void
    {
        $data = [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => 'password123',
            'password_confirmation' => 'differentpassword',
            'role' => 'applicant',
        ];
        $response = $this->postJson('/api/register', $data);
        $response->assertStatus(422)->assertJsonValidationErrors(['password']);
    }

    public function test_registration_requires_valid_role(): void
    {
        $password = $this->faker->password(8);
        $data = [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => $password,
            'password_confirmation' => $password,
            'role' => 'invalid-role',
        ];
        $response = $this->postJson('/api/register', $data);
        $response->assertStatus(422)->assertJsonValidationErrors(['role']);
    }

    public function test_user_can_login_with_correct_credentials(): void
    {
        $password = 'password123';
      
        $user = User::factory()->create([
            'password' => Hash::make($password),
            'role' => 'applicant',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => $password,
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'access_token',
                'token_type',
                'user' => [
                    'id',
                    'name',
                    'email',
                    'role',
                ],
            ])
            ->assertJsonPath('user.email', $user->email);
    }

    public function test_user_cannot_login_with_incorrect_credentials(): void
    {
     
        $user = User::factory()->create([
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(401)
            ->assertJson(['message' => 'Invalid login credentials']);
    }

    public function test_login_requires_email_and_password(): void
    {
        $response = $this->postJson('/api/login', []);
        $response->assertStatus(422)->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_authenticated_user_can_get_their_details(): void
    {
    
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/user');

        $response->assertStatus(200)
            ->assertJson([
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ]);
    }

    public function test_unauthenticated_user_cannot_get_user_details(): void
    {
        $response = $this->getJson('/api/user');
        $response->assertStatus(401);
    }
}
