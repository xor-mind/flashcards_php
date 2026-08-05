/* 
===============================================================
 Flashcards App Database Schema & Sample Data
---------------------------------------------------------------
 This SQL file defines the database structure used by the 
 Flashcards application, including:

   • categories  – hierarchical category structure
   • flashcards  – individual flashcards linked to categories

 It also includes sample data to help test the database 
 locally in XAMPP during development.

 You can safely import this file into phpMyAdmin on XAMPP.
===============================================================
*/
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `categories` (`id`, `name`, `parent_id`) VALUES
(1, 'Beginner', NULL),
(2, 'Intermediate', NULL),
(3, 'Example', 1),
(4, 'Documentation', 1),
(5, 'GUI', 2),
(6, 'Database', 2);

CREATE TABLE `flashcards` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `front` text NOT NULL,
  `back` text NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `flashcards_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `flashcards` (`id`, `front`, `back`, `category_id`) VALUES
(1, 'What is a GUI?', 'Graphical User Interface', 5),
(2, 'What is a pixel?', 'A pixel, short for picture element', 5),
(3, 'Give an example of a loop structure in programming.', 'For loop, while loop, do-while loop.', 3),
(4, 'What is recursion in computer science?', 'A method of solving a problem where the solution depends on solutions to smaller instances of the same problem.', 3),
(5, 'Why is documentation important in programming?', 'It helps others understand the codebase, making maintenance and updates easier.', 4),
(6, 'What should good documentation include?', 'Purpose of the code, how to install and use it, and examples of key functions.', 4),
(7, 'What is a primary key in a database?', 'A unique identifier for each row in a table.', 6),
(8, 'What is a foreign key?', 'A field in one table that uniquely identifies a row of another table or the same table.', 6);
