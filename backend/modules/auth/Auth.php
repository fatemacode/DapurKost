<?php

class Auth
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function authenticate(string $username, string $password, string $table = 'pelanggan'): array
    {
        $allowedTables = ['admin', 'pelanggan'];

        if (!in_array($table, $allowedTables, true)) {
            throw new InvalidArgumentException('Table tidak valid untuk autentikasi.');
        }

        $sql = "SELECT id, nama, username, password_hash FROM {$table} WHERE username = :username LIMIT 1";
        $statement = $this->pdo->prepare($sql);
        $statement->execute([':username' => $username]);
        $user = $statement->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            return [
                'success' => false,
                'message' => 'Username tidak ditemukan.',
            ];
        }

        if (!password_verify($password, $user['password_hash'])) {
            return [
                'success' => false,
                'message' => 'Password salah.',
            ];
        }

        return [
            'success' => true,
            'message' => 'Autentikasi berhasil.',
            'user' => [
                'id' => (int) $user['id'],
                'nama' => $user['nama'],
                'username' => $user['username'],
                'table' => $table,
            ],
        ];
    }
}
