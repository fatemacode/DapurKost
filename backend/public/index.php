<?php

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

$response = [
    'success' => true,
    'message' => 'Backend entry point is ready',
    'method' => $method,
    'uri' => $uri,
    'body' => $decodedBody,
];

http_response_code(200);
echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
