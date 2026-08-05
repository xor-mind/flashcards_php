<?php
// this is an example db.php. your server will have other stuff.
$host = 'localhost';
$username = 'root'; // default XAMPP username
$password = ''; // default XAMPP has no password
$database = 'flashcards'; // name of database for flashcard app

// Create connection
$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>