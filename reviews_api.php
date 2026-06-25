<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataFile = __DIR__ . '/reviews_data.json';

function readReviews($path)
{
    if (!file_exists($path)) return [];
    $raw = file_get_contents($path);
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function isValidReview($review)
{
    if (!is_array($review)) return false;
    if (!isset($review['name'], $review['text'], $review['photo'])) return false;
    if (!is_string($review['name']) || !is_string($review['text']) || !is_string($review['photo'])) return false;
    if (mb_strlen(trim($review['name'])) < 2) return false;
    if (mb_strlen(trim($review['text'])) < 8) return false;
    if (!str_starts_with($review['photo'], 'data:image/')) return false;
    return true;
}

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        $reviews = readReviews($dataFile);
        echo json_encode(['success' => true, 'reviews' => array_values($reviews)]);
        break;

    case 'POST':
        $json = file_get_contents('php://input');
        $review = json_decode($json, true);
        if (json_last_error() !== JSON_ERROR_NONE || !isValidReview($review)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid review']);
            exit;
        }

        $review['name'] = trim($review['name']);
        $review['text'] = trim($review['text']);

        $reviews = readReviews($dataFile);
        $reviews[] = $review;
        if (count($reviews) > 40) {
            $reviews = array_slice($reviews, -40);
        }

        $saved = file_put_contents($dataFile, json_encode($reviews, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
        if ($saved === false) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Persist failed']);
            exit;
        }

        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Method not allowed']);
        break;
}
