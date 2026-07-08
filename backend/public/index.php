<?php

require_once dirname(__DIR__) . '/core/Database.php';

header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$uri = $_SERVER['REQUEST_URI'] ?? '/';
$body = file_get_contents('php://input');
$decodedBody = null;

if ($body !== '') {
    $decodedBody = json_decode($body, true);
}

if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}

try {
    $database = Database::getConnection();

    $response = [
        'success' => true,
        'message' => 'Backend entry point is ready',
        'method' => $method,
        'uri' => $uri,
        'body' => $decodedBody,
        'database' => [
            'connected' => true,
        ],
    ];

    http_response_code(200);
} catch (Throwable $e) {
    $response = [
        'success' => false,
        'message' => 'Database connection failed',
        'method' => $method,
        'uri' => $uri,
        'body' => $decodedBody,
        'database' => [
            'connected' => false,
            'error' => $e->getMessage(),
        ],
    ];

    http_response_code(500);
}

echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
