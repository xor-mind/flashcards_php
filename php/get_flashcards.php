<?php
include 'db.php'; // Include database connection
header('Content-Type: application/json');

function getAllDescendantIds($categoryId, $conn) {
    $descendantIds = [];
    $queue = [$categoryId];

    while (!empty($queue)) {
        $currentId = array_shift($queue);
        $descendantIds[] = $currentId;

        // Fetch immediate child categories
        $query = "SELECT id FROM categories WHERE parent_id = $currentId";
        $result = $conn->query($query);
        while ($row = $result->fetch_assoc()) {
            $queue[] = $row['id'];
        }
    }

    return $descendantIds;
}


// Check if a category_id is provided for filtering
if (isset($_GET['category_id']) && is_numeric($_GET['category_id'])) {
    $category_id = $_GET['category_id'];
    $categoryIds = getAllDescendantIds($category_id, $conn);
    $inQuery = implode(',', array_fill(0, count($categoryIds), '?'));
    
    $stmt = $conn->prepare("SELECT * FROM flashcards WHERE category_id IN ($inQuery)");
    $stmt->bind_param(str_repeat('i', count($categoryIds)), ...$categoryIds);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    // No specific category_id provided, fetch all flashcards
    $sql = "SELECT * FROM flashcards";
    $result = $conn->query($sql);
}


$flashcards = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $flashcards[] = $row;
    }
    echo json_encode($flashcards);
} else {
    echo json_encode([]);
}

$conn->close();
?>
