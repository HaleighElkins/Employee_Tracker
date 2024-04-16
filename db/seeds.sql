-- Inserting departments
INSERT INTO department (department_name)
VALUES 
    ('Engineering'), 
    ('Sales'), 
    ('Finance'), 
    ('Legal'), 
    ('Marketing');

-- Inserting roles
INSERT INTO role (title, salary, department_id)
VALUES
    ('Engineer', 85000, 1),
    ('Senior Engineer', 125000, 1),
    ('CFO', 350000, 3),
    ('Chief Counsel', 300000, 4);

-- Inserting employees
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Johnnie', 'Random', 1, 2),
    ('James', 'Smith', 1, NULL), -- Assuming no manager
    ('Ronnie', 'Manning', 1, 2),
    ('Jimmy', 'Jones', 2, 2),
    ('Larry', 'Legal', 4, NULL); -- Assuming no manager
