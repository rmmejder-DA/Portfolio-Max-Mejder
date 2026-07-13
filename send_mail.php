<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

$recipientEmail = "rmmejder@gmail.com";
$senderEmail = "noreply@max-mejder.de";

switch ($_SERVER['REQUEST_METHOD']) {
    case 'OPTIONS':
        http_response_code(200);
        exit;

    case 'POST':
        $json = file_get_contents('php://input');
        $params = json_decode($json);

        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid JSON']);
            exit;
        }

        $email = $params->email ?? '';
        $name = $params->name ?? '';
        $userMessage = $params->message ?? '';

        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || empty($name) || empty($userMessage)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid input data']);
            exit;
        }

        // Versuche, Email über FormSubmit.co zu versenden (zuverlässig)
        $formSubmitPayload = [
            'name' => $name,
            'email' => $email,
            'message' => $userMessage,
            '_subject' => 'Website Contact Form',
            '_template' => 'table',
            '_captcha' => 'false'
        ];

        $curlHandle = curl_init();
        curl_setopt_array($curlHandle, [
            CURLOPT_URL => 'https://formsubmit.co/ajax/' . $recipientEmail,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
            CURLOPT_POSTFIELDS => json_encode($formSubmitPayload),
            CURLOPT_TIMEOUT => 10
        ]);

        $response = curl_exec($curlHandle);
        $httpCode = curl_getinfo($curlHandle, CURLINFO_HTTP_CODE);
        curl_close($curlHandle);

        if ($httpCode === 200 && $response) {
            $responseData = json_decode($response, true);
            if ($responseData && ($responseData['success'] === 'true' || $responseData['success'] === true)) {
                echo json_encode(['success' => true]);
                exit;
            }
        }

        // Fallback: Versuche native PHP mail() Funktion
        $safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
        $safeEmail = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
        $safeMessage = nl2br(htmlspecialchars($userMessage, ENT_QUOTES, 'UTF-8'));

        $subject = 'Website Contact Form';

        $mailBody = "
            <strong>Name:</strong> {$safeName}<br>
            <strong>Email:</strong> {$safeEmail}<br><br>
            <strong>Message:</strong><br>
            {$safeMessage}
        ";

        $headers = [];
        $headers[] = 'MIME-Version: 1.0';
        $headers[] = 'Content-type: text/html; charset=utf-8';
        $headers[] = 'From: Website Kontakt <' . $senderEmail . '>';
        $headers[] = 'Reply-To: ' . $safeEmail;

        $success = @mail(
            $recipientEmail,
            $subject,
            $mailBody,
            implode("\r\n", $headers)
        );

        if ($success) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Mail delivery failed']);
        }

        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Method not allowed']);
        exit;
}
