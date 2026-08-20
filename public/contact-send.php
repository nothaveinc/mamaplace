<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function respond(int $status, bool $ok, string $message): void
{
    http_response_code($status);
    echo json_encode(
        ['ok' => $ok, 'message' => $message],
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, false, '送信方法が正しくありません。');
}

$requestHost = strtolower(
    preg_replace('/:\\d+$/', '', (string) ($_SERVER['HTTP_HOST'] ?? ''))
);
$origin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
if ($origin !== '') {
    $originHost = strtolower((string) parse_url($origin, PHP_URL_HOST));
    if ($originHost === '' || $requestHost === '' || !hash_equals($requestHost, $originHost)) {
        respond(403, false, '送信元を確認できませんでした。');
    }
}

$contentType = (string) ($_SERVER['CONTENT_TYPE'] ?? '');
if (stripos($contentType, 'application/json') !== 0) {
    respond(415, false, '送信形式が正しくありません。');
}

$contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength > 15000) {
    respond(413, false, 'お問い合わせ内容が長すぎます。');
}

$rawBody = file_get_contents('php://input');
if ($rawBody === false || strlen($rawBody) > 15000) {
    respond(400, false, '送信内容を読み取れませんでした。');
}

$data = json_decode($rawBody, true);
if (!is_array($data)) {
    respond(400, false, '送信内容が正しくありません。');
}

// 通常の利用者には見えない項目です。入力されている場合はボットと判断します。
$website = trim((string) ($data['website'] ?? ''));
if ($website !== '') {
    respond(200, true, 'お問い合わせを受け付けました。');
}

$name = trim((string) ($data['name'] ?? ''));
$email = trim((string) ($data['email'] ?? ''));
$type = trim((string) ($data['type'] ?? ''));
$message = trim((string) ($data['message'] ?? ''));
$agree = ($data['agree'] ?? false) === true;

if ($name === '' || mb_strlen($name, 'UTF-8') > 100) {
    respond(422, false, 'お名前を100文字以内で入力してください。');
}
if (
    $email === ''
    || strlen($email) > 254
    || preg_match('/[\\r\\n]/', $email)
    || filter_var($email, FILTER_VALIDATE_EMAIL) === false
) {
    respond(422, false, '正しいメールアドレスを入力してください。');
}
if ($message === '' || mb_strlen($message, 'UTF-8') > 5000) {
    respond(422, false, 'メッセージを5000文字以内で入力してください。');
}
if (!$agree) {
    respond(422, false, 'プライバシーポリシーへの同意が必要です。');
}

$typeLabels = [
    '' => '未選択',
    'facility' => '施設情報について',
    'subsidy' => '公費助成について',
    'feedback' => 'サービスへのご意見',
    'listing' => '施設掲載希望',
    'other' => 'その他',
];
if (!array_key_exists($type, $typeLabels)) {
    respond(422, false, 'お問い合わせ種別が正しくありません。');
}

$isSecure = (
    (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (string) ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https'
);
session_name('mamaplace_contact');
session_start([
    'cookie_httponly' => true,
    'cookie_secure' => $isSecure,
    'cookie_samesite' => 'Strict',
    'use_strict_mode' => true,
]);

$lastSentAt = (int) ($_SESSION['last_sent_at'] ?? 0);
if ($lastSentAt > 0 && time() - $lastSentAt < 30) {
    respond(429, false, '連続送信はできません。少し時間をおいてください。');
}

$recipient = 'moeno.t.6612@gmail.com';
$fromAddress = 'contact@mamaplace.jp';
$subject = '【MamaPlace】お問い合わせが届きました';
date_default_timezone_set('Asia/Tokyo');
$submittedAt = date('Y-m-d H:i:s');
$body = implode("\n", [
    'MamaPlaceのお問い合わせフォームから送信がありました。',
    '',
    '送信日時：' . $submittedAt,
    'お名前：' . $name,
    'メールアドレス：' . $email,
    'お問い合わせ種別：' . $typeLabels[$type],
    '',
    'お問い合わせ内容',
    '------------------------------',
    $message,
    '------------------------------',
]);

$encodedSubject = mb_encode_mimeheader($subject, 'UTF-8', 'B', "\r\n");
$encodedBody = rtrim(chunk_split(base64_encode($body), 76, "\r\n"));

$headers = implode("\r\n", [
    'From: MamaPlace <' . $fromAddress . '>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    'X-Mailer: PHP/' . PHP_VERSION,
]);

$sent = mail(
    $recipient,
    $encodedSubject,
    $encodedBody,
    $headers,
    '-f ' . $fromAddress
);

if (!$sent) {
    error_log('MamaPlace contact form: mail failed.');
    respond(500, false, 'メールを送信できませんでした。');
}

$_SESSION['last_sent_at'] = time();
respond(200, true, 'お問い合わせを受け付けました。');
