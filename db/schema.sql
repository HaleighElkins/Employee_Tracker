-- Drop the database if it exists
DROP DATABASE IF EXISTS employees;

-- Create the database
CREATE DATABASE employees; 

-- Use the employees database
USE employees;

-- Create the department table
CREATE TABLE IF NOT EXISTS department (
    id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(30) NOT NULL
);

-- Create the role table
CREATE TABLE IF NOT EXISTS role (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INTEGER
);

-- Create the employee table
CREATE TABLE IF NOT EXISTS employee (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER,
    manager_id INTEGER
);
