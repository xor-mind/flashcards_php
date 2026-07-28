<?php
include 'db.php';

header('Content-Type: application/json');

$sql = "SELECT id, name, parent_id FROM categories ORDER BY parent_id ASC, name ASC";
$result = $conn->query($sql);

$categories = [];
if ($result->num_rows > 0) 
{
    while($row = $result->fetch_assoc()) 
    {
        if ($row['parent_id'] === NULL) 
        {
            $row['children'] = [];
            $categories[$row['id']] = $row;
        } 
        else 
        {
            $categories[$row['parent_id']]['children'][] = $row;
        }
    }
}

// Filter out only top-level categories to simplify the JSON
// $topLevelCategories = array_filter($categories, function($category) {
//     return $category['parent_id'] === NULL;
// });

echo json_encode(array_values($categories)); // Ensure numerical array for JSON
$conn->close();
?>
