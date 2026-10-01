<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $type = $_POST['type'] ?? '';
    if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK || empty($type)) {
        die(json_encode(['success' => false, 'error' => 'Invalid file or type.']));
    }

    $uploadDir = 'uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $fileTmpPath = $_FILES['file']['tmp_name'];
    $fileName = $_FILES['file']['name'];
    $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

    if ($fileExtension !== 'xlsx') {
        die(json_encode(['success' => false, 'error' => 'Only XLSX files are allowed.']));
    }

    $newFileName = $type . '_' . time() . '.' . $fileExtension;
    $destPath = $uploadDir . $newFileName;

    if (move_uploaded_file($fileTmpPath, $destPath)) {
        // Parse with python
        $command = escapeshellcmd("python parse_excel.py " . escapeshellarg($type) . " " . escapeshellarg($destPath));
        $output = shell_exec($command);
        $result = json_decode($output, true);

        if ($result && isset($result['success']) && $result['success']) {
            $jsonData = json_encode($result['data']);

            // Save to DB
            $stmt = $pdo->prepare("SELECT id FROM graphs WHERE type = ?");
            $stmt->execute([$type]);
            $graphId = $stmt->fetchColumn();

            if ($graphId) {
                $pdo->prepare("UPDATE graphs SET file_path = ? WHERE id = ?")->execute([$destPath, $graphId]);

                $pdo->prepare("DELETE FROM graph_data WHERE graph_id = ?")->execute([$graphId]);
                $pdo->prepare("INSERT INTO graph_data (graph_id, data_json) VALUES (?, ?)")->execute([$graphId, $jsonData]);

                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'error' => 'Graph type not found in DB.']);
            }
        } else {
            echo json_encode(['success' => false, 'error' => 'Failed to parse Excel: ' . ($result['error'] ?? 'Unknown error')]);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'File move failed.']);
    }
}
?>
