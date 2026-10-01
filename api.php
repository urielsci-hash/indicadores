<?php
require 'db.php';
header('Content-Type: application/json');

$action = $_GET['action'] ?? '';

if ($action === 'get_graphs') {
    $stmt = $pdo->query("
        SELECT g.type, g.title, gd.data_json
        FROM graphs g
        JOIN graph_data gd ON g.id = gd.graph_id
    ");
    $graphs = [];
    while ($row = $stmt->fetch()) {
        $graphs[$row['type']] = [
            'title' => $row['title'],
            'data' => json_decode($row['data_json'], true)
        ];
    }
    echo json_encode(['success' => true, 'graphs' => $graphs]);
}
?>
