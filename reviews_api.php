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
$pendingFile = __DIR__ . '/reviews_pending.json';

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
        $action = $_GET['action'] ?? 'approved';
        $language = $_GET['lang'] ?? 'en';
        $language = in_array($language, ['de', 'en']) ? $language : 'en';
        
        if ($action === 'pending') {
            $pending = readReviews($pendingFile);
            echo json_encode(['success' => true, 'reviews' => array_values($pending)]);
        } else if ($action === 'approved') {
            $allReviews = readReviews($dataFile);
            
            // Wenn es ein Objekt mit Sprachen ist, nimm die richtige Sprache
            if (is_array($allReviews) && isset($allReviews[$language])) {
                $reviews = $allReviews[$language];
            } 
            // Fallback für alte Struktur (einfaches Array)
            else if (is_array($allReviews) && !isset($allReviews[0])) {
                $reviews = isset($allReviews['en']) ? $allReviews['en'] : [];
            } 
            else {
                $reviews = $allReviews;
            }
            
            echo json_encode(['success' => true, 'reviews' => array_values($reviews)]);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid action']);
        }
        break;

    case 'POST':
        $action = $_GET['action'] ?? 'submit';
        
        if ($action === 'submit') {
            $json = file_get_contents('php://input');
            $review = json_decode($json, true);
            if (json_last_error() !== JSON_ERROR_NONE || !isValidReview($review)) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Invalid review', 'json_error' => json_last_error_msg()]);
                exit;
            }

            $review['name'] = trim($review['name']);
            $review['text'] = trim($review['text']);
            $review['timestamp'] = date('Y-m-d H:i:s');

            $pending = readReviews($pendingFile);
            $pending[] = $review;

            $saved = @file_put_contents($pendingFile, json_encode($pending, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
            if ($saved === false) {
                http_response_code(500);
                echo json_encode(['success' => false, 'error' => 'Failed to save review. Check file permissions.']);
                exit;
            }

            echo json_encode(['success' => true, 'message' => 'Review submitted for moderation']);
        } 
        else if ($action === 'approve') {
            $json = file_get_contents('php://input');
            $data = json_decode($json, true);
            
            if (!isset($data['indices']) || !is_array($data['indices'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Invalid indices']);
                exit;
            }

            $pending = readReviews($pendingFile);
            $approved = readReviews($dataFile);
            
            $indicesToApprove = array_filter($data['indices'], 'is_int');
            $indicesToApprove = array_unique($indicesToApprove);
            rsort($indicesToApprove);

            foreach ($indicesToApprove as $index) {
                if (isset($pending[$index])) {
                    $review = $pending[$index];
                    unset($review['timestamp']);
                    $approved[] = $review;
                    unset($pending[$index]);
                }
            }

            $pending = array_values($pending);

            if (count($approved) > 40) {
                $approved = array_slice($approved, -40);
            }

            file_put_contents($dataFile, json_encode($approved, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
            file_put_contents($pendingFile, json_encode($pending, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);

            echo json_encode(['success' => true, 'message' => 'Reviews approved']);
        }
        else if ($action === 'delete') {
            $json = file_get_contents('php://input');
            $data = json_decode($json, true);
            
            if (!isset($data['indices']) || !is_array($data['indices'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Invalid indices']);
                exit;
            }

            $pending = readReviews($pendingFile);
            
            $indicesToDelete = array_filter($data['indices'], 'is_int');
            $indicesToDelete = array_unique($indicesToDelete);
            rsort($indicesToDelete);

            foreach ($indicesToDelete as $index) {
                if (isset($pending[$index])) {
                    unset($pending[$index]);
                }
            }

            $pending = array_values($pending);
            file_put_contents($pendingFile, json_encode($pending, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);

            echo json_encode(['success' => true, 'message' => 'Reviews deleted']);
        }
        else {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid action']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Method not allowed']);
        break;
}
