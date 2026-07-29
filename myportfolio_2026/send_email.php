<?php
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
    exit;
}

// Honeypot: if this hidden field is filled, it's a bot. Pretend success, do nothing.
if (!empty($_POST['website'])) {
    echo json_encode(["success" => true, "message" => "Message sent."]);
    exit;
}

$name    = htmlspecialchars(strip_tags(trim($_POST["name"] ?? '')));
$email   = filter_var(trim($_POST["email"] ?? ''), FILTER_SANITIZE_EMAIL);
$subject = htmlspecialchars(strip_tags(trim($_POST["subject"] ?? '')));
$message = htmlspecialchars(strip_tags(trim($_POST["message"] ?? '')));

if ($name === '' || $email === '' || $subject === '' || $message === '') {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Please fill in every field."]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "That email address doesn't look right."]);
    exit;
}

// Where the message goes
$to = "diyarpouryousef@gmail.com";
$emailSubject = "Portfolio contact: " . $subject;

// Use the site's own domain for the From address (many mail servers reject
// or spam-flag a From header using an arbitrary visitor's email address).
// The visitor's real email goes in Reply-To so you can just hit reply.
$host = $_SERVER['SERVER_NAME'] ?? 'localhost';
$host = preg_replace('/^www\./', '', $host);
$fromAddress = "noreply@" . $host;

$headers  = "From: Portfolio Contact Form <$fromAddress>\r\n";
$headers .= "Reply-To: $name <$email>\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$emailBody = "
    <h2>New message from your portfolio site</h2>
    <p><strong>Name:</strong> $name</p>
    <p><strong>Email:</strong> $email</p>
    <p><strong>Subject:</strong> $subject</p>
    <p><strong>Message:</strong><br>" . nl2br($message) . "</p>
";

if (mail($to, $emailSubject, $emailBody, $headers)) {
    echo json_encode(["success" => true, "message" => "Message sent. I'll get back to you soon."]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Something went wrong on the server. Please email me directly at diyarpouryousef@gmail.com."]);
}
