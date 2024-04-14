const connection = require('./config/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');
const chalk = require('chalk');
const figlet = require('figlet');
const validate = require('./javascript/validate');

// Database Connection and Starter Title
connection.connect((error) => {
    if (error) throw error;
    displayTitle();
  });
  
  // Function to display the title
  const displayTitle = () => {
    console.log(chalk.yellow.bold(`====================================================================================`));
    console.log(``);
    console.log(chalk.greenBright.bold(figlet.textSync('Employee Tracker')));
    console.log(``);
    console.log(`                                                          ` + chalk.greenBright.bold('Created By: Joseph DeWoody'));
    console.log(``);
    console.log(chalk.yellow.bold(`====================================================================================`));
    promptUser();
  };
  
  // Prompt User for Choices
  const promptUser = () => {
    inquirer.prompt([
        {
          name: 'choices',
          type: 'list',
          message: 'Please select an option:',
          choices: [
            'View All Employees',
            'View All Roles',
            'View All Departments',
            'View All Employees By Department',
            'View Department Budgets',
            'Update Employee Role',
            'Update Employee Manager',
            'Add Employee',
            'Add Role',
            'Add Department',
            'Remove Employee',
            'Remove Role',
            'Remove Department',
            'Exit'
            ]
        }
      ])
      .then((answers) => {
        const { choices } = answers;
    
        switch (choices) {
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'View All Employees By Department':
                viewEmployeesByDepartment();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Remove Employee':
                removeEmployee();
                break;
            case 'Update Employee Role':
                updateEmployeeRole();
                break;
            case 'Update Employee Manager':
                updateEmployeeManager();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Remove Role':
                removeRole();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'View Department Budgets':
                viewDepartmentBudget();
                break;
            case 'Remove Department':
                removeDepartment();
                break;
            case 'Exit':
                connection.end();
                break;
            default:
                console.log('Invalid choice');
        }
    });
    
//   ----- View Employees------ 

// View All Employees
const viewAllEmployees = () => {
    const sql = `SELECT employee.id, 
                employee.first_name, 
                employee.last_name, 
                role.title, 
                department.department_name AS 'department', 
                role.salary
                FROM employee
                INNER JOIN role ON role.id = employee.role_id
                INNER JOIN department ON department.id = role.department_id
                ORDER BY employee.id ASC`;

    connection.promise().query(sql, (error, response) => {
        if (error) throw error;

        console.log(chalk.yellow.bold(`====================================================================================`));
        console.log(`                              ` + chalk.green.bold(`Current Employees:`));
        console.log(chalk.yellow.bold(`====================================================================================`));
        console.table(response);
        console.log(chalk.yellow.bold(`====================================================================================`));
        promptUser();
    });
};

// View all Roles
const viewAllRoles = () => {
    const sql = `SELECT role.id, role.title, department.department_name AS department
                FROM role
                INNER JOIN department ON role.department_id = department.id`;

    connection.promise().query(sql, (error, response) => {
        if (error) throw error;

        console.log(chalk.yellow.bold(`====================================================================================`));
        console.log(`                              ` + chalk.green.bold(`Current Employee Roles:`));
        console.log(chalk.yellow.bold(`====================================================================================`));

        response.forEach((role) => {
            console.log(role.title);
        });

        console.log(chalk.yellow.bold(`====================================================================================`));
        promptUser();
    });
};

// View all Departments
const viewAllDepartments = () => {
    const sql = `SELECT department.id AS id, department.department_name AS department FROM department`;

    connection.promise().query(sql, (error, response) => {
        if (error) throw error;

        console.log(chalk.yellow.bold(`====================================================================================`));
        console.log(`                              ` + chalk.green.bold(`All Departments:`));
        console.log(chalk.yellow.bold(`====================================================================================`));
        console.table(response);
        console.log(chalk.yellow.bold(`====================================================================================`));
        promptUser();
    });
};

// View all Employees by Department
const viewEmployeesByDepartment = () => {
    const sql = `SELECT employee.first_name, 
                employee.last_name, 
                department.department_name AS department
                FROM employee 
                LEFT JOIN role ON employee.role_id = role.id 
                LEFT JOIN department ON role.department_id = department.id`;

    connection.query(sql, (error, response) => {
        if (error) throw error;

        console.log(chalk.yellow.bold(`====================================================================================`));
        console.log(`                              ` + chalk.green.bold(`Employees by Department:`));
        console.log(chalk.yellow.bold(`====================================================================================`));
        console.table(response);
        console.log(chalk.yellow.bold(`====================================================================================`));
        promptUser();
    });
};

// View all Departments by Budget
const viewDepartmentBudget = () => {
    const sql = `SELECT department_id AS id, 
                department.department_name AS department,
                SUM(salary) AS budget
                FROM  role  
                INNER JOIN department ON role.department_id = department.id GROUP BY  role.department_id`;

    connection.query(sql, (error, response) => {
        if (error) throw error;

        console.log(chalk.yellow.bold(`====================================================================================`));
        console.log(`                              ` + chalk.green.bold(`Budget By Department:`));
        console.log(chalk.yellow.bold(`====================================================================================`));
        console.table(response);
        console.log(chalk.yellow.bold(`====================================================================================`));
        promptUser();
    });
};
// Add Employee 
// Add a New Employee
const addEmployee = () => {
    inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: "What is the employee's first name?",
        validate: input => input ? true : "Please enter a first name"
      },
      {
        type: 'input',
        name: 'lastName',
        message: "What is the employee's last name?",
        validate: input => input ? true : "Please enter a last name"
      }
    ]).then(answers => {
      const { firstName, lastName } = answers;
      getRoles(firstName, lastName);
    });
  };
  
  // Helper function to fetch roles
  const getRoles = (firstName, lastName) => {
    const roleSql = `SELECT role.id, role.title FROM role`;
    connection.promise().query(roleSql, (error, data) => {
      if (error) throw error; 
      const roles = data.map(({ id, title }) => ({ name: title, value: id }));
      inquireRoleAndManager(firstName, lastName, roles);
    });
  };
  
  // Helper function to inquire about role and manager
  const inquireRoleAndManager = (firstName, lastName, roles) => {
    inquirer.prompt([
      {
        type: 'list',
        name: 'role',
        message: "What is the employee's role?",
        choices: roles
      }
    ]).then(roleChoice => {
      const { role } = roleChoice;
      getManagers(firstName, lastName, role);
    });
  };
  
  // Helper function to fetch managers
  const getManagers = (firstName, lastName, role) => {
    const managerSql =  `SELECT * FROM employee`;
    connection.promise().query(managerSql, (error, data) => {
      if (error) throw error;
      const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
      inquireManager(firstName, lastName, role, managers);
    });
  };
  
  // Helper function to inquire about manager
  const inquireManager = (firstName, lastName, role, managers) => {
    inquirer.prompt([
      {
        type: 'list',
        name: 'manager',
        message: "Who is the employee's manager?",
        choices: managers
      }
    ]).then(managerChoice => {
      const { manager } = managerChoice;
      const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
      connection.query(sql, [firstName, lastName, role, manager], (error) => {
        if (error) throw error;
        console.log("Employee has been added!");
        viewAllEmployees();
      });
    });
  };
  
  // Add a New Role
  const addRole = () => {
    getDepartmentNames();
  };
  
  // Helper function to fetch department names
  const getDepartmentNames = () => {
    const sql = 'SELECT * FROM department';
    connection.promise().query(sql, (error, response) => {
      if (error) throw error;
      const deptNamesArray = response.map(department => department.department_name);
      deptNamesArray.push('Create Department');
      inquireDepartment(deptNamesArray);
    });
  };
  
  // Helper function to inquire about department
  const inquireDepartment = (deptNamesArray) => {
    inquirer.prompt([
      {
        name: 'departmentName',
        type: 'list',
        message: 'Which department is this new role in?',
        choices: deptNamesArray
      }
    ]).then(answer => {
      if (answer.departmentName === 'Create Department') {
        addDepartment();
      } else {
        addRoleDetails(answer);
      }
    });
  };
  
  // Helper function to add role details
  const addRoleDetails = (departmentData) => {
    inquirer.prompt([
      {
        name: 'newRole',
        type: 'input',
        message: 'What is the name of your new role?',
        validate: input => input ? true : "Please enter a role name"
      },
      {
        name: 'salary',
        type: 'input',
        message: 'What is the salary of this new role?',
        validate: input => input ? true : "Please enter a salary"
      }
    ]).then(answer => {
      const { newRole, salary } = answer;
      const departmentId = departmentData.departmentName.id;
      const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
      connection.query(sql, [newRole, salary, departmentId], (error) => {
        if (error) throw error;
        console.log(chalk.yellow.bold(`====================================================================================`));
        console.log(chalk.greenBright(`Role successfully created!`));
        console.log(chalk.yellow.bold(`====================================================================================`));
        viewAllRoles();
      });
    });
  };
  
  // Add a New Department
  const addDepartment = () => {
    inquirer.prompt([
      {
        name: 'newDepartment',
        type: 'input',
        message: 'What is the name of your new Department?',
        validate: input => input ? true : "Please enter a department name"
      }
    ]).then(answer => {
      const sql = `INSERT INTO department (department_name) VALUES (?)`;
      connection.query(sql, answer.newDepartment, (error, response) => {
        if (error) throw error;
        console.log(``);
        console.log(chalk.greenBright(answer.newDepartment + ` Department successfully created!`));
        console.log(``);
        viewAllDepartments();
      });
    });
  };
  
//  Updating
// Update an Employee's Role
const updateEmployeeRole = async () => {
    try {
        const employeeRoleQuery = `
            SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id"
            FROM employee, role, department 
            WHERE department.id = role.department_id AND role.id = employee.role_id`;

        const [employeeRoleResponse] = await connection.promise().query(employeeRoleQuery);

        const employeeNamesArray = employeeRoleResponse.map(employee => `${employee.first_name} ${employee.last_name}`);

        const rolesQuery = `SELECT role.id, role.title FROM role`;
        const [rolesResponse] = await connection.promise().query(rolesQuery);
        const rolesArray = rolesResponse.map(role => role.title);

        const answer = await inquirer.prompt([
            {
                name: 'chosenEmployee',
                type: 'list',
                message: 'Which employee has a new role?',
                choices: employeeNamesArray
            },
            {
                name: 'chosenRole',
                type: 'list',
                message: 'What is their new role?',
                choices: rolesArray
            }
        ]);

        const { chosenEmployee, chosenRole } = answer;

        const newRoleId = rolesResponse.find(role => role.title === chosenRole).id;
        const employeeId = employeeRoleResponse.find(employee => `${employee.first_name} ${employee.last_name}` === chosenEmployee).id;

        const updateQuery = `UPDATE employee SET role_id = ? WHERE id = ?`;

        await connection.promise().query(updateQuery, [newRoleId, employeeId]);

        console.log(chalk.greenBright.bold(`====================================================================================`));
        console.log(chalk.greenBright(`Employee Role Updated`));
        console.log(chalk.greenBright.bold(`====================================================================================`));
        promptUser();
    } catch (error) {
        console.error(error);
    }
};

// Update an Employee's Manager
const updateEmployeeManager = async () => {
    try {
        const employeesQuery = `SELECT id, first_name, last_name FROM employee`;
        const [employeesResponse] = await connection.promise().query(employeesQuery);
        const employeeNamesArray = employeesResponse.map(employee => `${employee.first_name} ${employee.last_name}`);

        const answer = await inquirer.prompt([
            {
                name: 'chosenEmployee',
                type: 'list',
                message: 'Which employee has a new manager?',
                choices: employeeNamesArray
            },
            {
                name: 'newManager',
                type: 'list',
                message: 'Who is their manager?',
                choices: employeeNamesArray
            }
        ]);

        const { chosenEmployee, newManager } = answer;

        const employeeId = employeesResponse.find(employee => `${employee.first_name} ${employee.last_name}` === chosenEmployee).id;
        const managerId = employeesResponse.find(employee => `${employee.first_name} ${employee.last_name}` === newManager).id;

        if (employeeId === managerId) {
            console.log(chalk.redBright.bold(`====================================================================================`));
            console.log(chalk.redBright(`Invalid Manager Selection`));
            console.log(chalk.redBright.bold(`====================================================================================`));
            promptUser();
            return;
        }

        const updateQuery = `UPDATE employee SET manager_id = ? WHERE id = ?`;
        await connection.promise().query(updateQuery, [managerId, employeeId]);

        console.log(chalk.greenBright.bold(`====================================================================================`));
        console.log(chalk.greenBright(`Employee Manager Updated`));
        console.log(chalk.greenBright.bold(`====================================================================================`));
        promptUser();
    } catch (error) {
        console.error(error);
    }
};

// Removing

// Delete an Employee
const removeEmployee = async () => {
    try {
        const sql = `SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee`;
        const [response] = await connection.promise().query(sql);
        const employeeChoices = response.map(employee => ({ name: employee.name, value: employee.id }));

        const answer = await inquirer.prompt([
            {
                name: 'chosenEmployee',
                type: 'list',
                message: 'Which employee would you like to remove?',
                choices: employeeChoices
            }
        ]);

        const { chosenEmployee } = answer;
        const deleteQuery = `DELETE FROM employee WHERE id = ?`;
        await connection.promise().query(deleteQuery, [chosenEmployee]);

        console.log(chalk.redBright.bold(`====================================================================================`));
        console.log(chalk.redBright(`Employee Successfully Removed`));
        console.log(chalk.redBright.bold(`====================================================================================`));
        viewAllEmployees();
    } catch (error) {
        console.error(error);
    }
};

// Delete a Role
const removeRole = async () => {
    try {
        const sql = `SELECT id, title FROM role`;
        const [response] = await connection.promise().query(sql);
        const roleChoices = response.map(role => ({ name: role.title, value: role.id }));

        const answer = await inquirer.prompt([
            {
                name: 'chosenRole',
                type: 'list',
                message: 'Which role would you like to remove?',
                choices: roleChoices
            }
        ]);

        const { chosenRole } = answer;
        const deleteQuery = `DELETE FROM role WHERE id = ?`;
        await connection.promise().query(deleteQuery, [chosenRole]);

        console.log(chalk.redBright.bold(`====================================================================================`));
        console.log(chalk.redBright(`Role Successfully Removed`));
        console.log(chalk.redBright.bold(`====================================================================================`));
        viewAllRoles();
    } catch (error) {
        console.error(error);
    }
};

// Delete a Department
const removeDepartment = async () => {
    try {
        const sql = `SELECT id, department_name AS name FROM department`;
        const [response] = await connection.promise().query(sql);
        const departmentChoices = response.map(department => ({ name: department.name, value: department.id }));

        const answer = await inquirer.prompt([
            {
                name: 'chosenDept',
                type: 'list',
                message: 'Which department would you like to remove?',
                choices: departmentChoices
            }
        ]);

        const { chosenDept } = answer;
        const deleteQuery = `DELETE FROM department WHERE id = ?`;
        await connection.promise().query(deleteQuery, [chosenDept]);

        console.log(chalk.redBright.bold(`====================================================================================`));
        console.log(chalk.redBright(`Department Successfully Removed`));
        console.log(chalk.redBright.bold(`====================================================================================`));
        viewAllDepartments();
    } catch (error) {
        console.error(error);
    }
};
  };