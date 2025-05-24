<?php
header('Content-Type: application/json');
session_start();

// Simulate payment verification (in real app, integrate with M-Pesa API)
$data = json_decode(file_get_contents('php://input'), true);

// Validate input
if(empty($data['phone']) || empty($data['amount']) || empty($data['configFile'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit;
}

// In a real app, you would verify the payment with M-Pesa API here
// For this example, we'll just simulate success after some validation

// Validate phone number format (Kenyan)
if (!preg_match('/^(07|01)[0-9]{8}$/', $data['phone'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid phone number format']);
    exit;
}

// Validate amount is numeric
if (!is_numeric($data['amount'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid amount']);
    exit;
}

// Grant premium access
$_SESSION['premium_access'] = true;
$_SESSION['premium_file'] = $data['configFile'];
$_SESSION['expiry'] = time() + (30 * 24 * 60 * 60); // 30 days

// Also store in localStorage for client-side (demo purposes)
$premiumData = [
    'configId' => $data['configId'],
    'file' => $data['configFile'],
    'expiry' => time() + (30 * 24 * 60 * 60)
];

echo json_encode([
    'success' => true,
    'message' => 'Payment verified',
    'premiumData' => $premiumData
]);
?>