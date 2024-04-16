-- Create the department table
CREATE TABLE IF NOT EXISTS department (
    id SERIAL PRIMARY KEY,
    department_name VARCHAR(30) NOT NULL
);

-- Create the role table
CREATE TABLE IF NOT EXISTS role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INTEGER
);

-- Create the employee table
CREATE TABLE IF NOT EXISTS employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER,
    manager_id INTEGER
);
