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










// // Const used to initialize the npm modules used in this file
// const inquirer = require('inquirer');
// const figlet = require('figlet');

// // This code calls various files in my lib folder that contain objects I reference
// const connection = require("./lib/SQL_login");
// const commandMenuChoices = require('./lib/commandMenu');
// const questions = require('./lib/questions');

// // This code calls my classes
// const InquirerFunctions = require('./lib/inquirer');
// const SQLquery = require('./lib/SQL_queries');

// // This array contains the inquirer prompt types I use
// const inquirerTypes = [
//     'input', 'confirm', 'list'
// ];

// // This line of code runs a synchronous function through the figlet npm that displays the designated text string in the console
// console.log(figlet.textSync('Employee Management', {
//     font: 'Standard',
//     horizontalLayout: 'default',
//     verticalLayout: 'default'
// }));

// // This line begins the app calling the main menu function
// mainMenu();

// function mainMenu() {
//   // Create an instance of InquirerFunctions to prompt the main menu choice
//   const menuPrompt = new InquirerFunctions(inquirerTypes[2], 'menuChoice', questions.mainMenuPrompt, commandMenuChoices);
  
//   // Prompt the user for the main menu choice
//   inquirer.prompt([menuPrompt.ask()])
//       .then(async operation => {
//           switch (operation.menuChoice) {
//               case commandMenuChoices[2]:
//                   // View all employees
//                   return viewAllEmp();

//               case commandMenuChoices[3]:
//                   // View employees in a specific department
//                   const depNamesArray = await SQLquery.queryReturnResult("SELECT department.name FROM department");
//                   return viewAllEmpDep(depNamesArray);

//               case commandMenuChoices[4]:
//                   // View employees under a specific manager
//                   return EmpInfoPrompts([], "VIEW BY MANAGER");

//               case commandMenuChoices[5]:
//                   // View employees by their role title, salary, and department
//                   const rolesArray = await SQLquery.getQueryNoRepeats("SELECT role.title FROM role");
//                   return viewAllEmpRole(rolesArray);

//               case commandMenuChoices[6]:
//                   // View all managers and their departments
//                   return viewAllManager();

//               case commandMenuChoices[11]:
//                   // Add an employee
//                   const addEmployeeAction = "ADD";
//                   return EmpInfoPrompts([], addEmployeeAction);

//               case commandMenuChoices[12]:
//                   // Delete an employee
//                   const deleteEmployeeAction = "DELETE";
//                   return EmpInfoPrompts([], deleteEmployeeAction);

//               case commandMenuChoices[13]:
//                   // Update an employee's role
//                   const updateRoleAction = "UPDATE EMP ROLE";
//                   return EmpInfoPrompts([], updateRoleAction);

//               case commandMenuChoices[14]:
//                   // Update an employee's manager
//                   const updateManagerAction = "UPDATE EMP MANAGER";
//                   return EmpInfoPrompts([], updateManagerAction);

//               case commandMenuChoices[1]:
//                   // View all roles with salary and department information
//                   return viewAllRoles();

//               case commandMenuChoices[9]:
//                   // Add a role
//                   return addRole();

//               case commandMenuChoices[10]:
//                   // Delete a role
//                   const deleteRoleAction = "DELETE ROLE";
//                   return deleteRole(deleteRoleAction);

//               case commandMenuChoices[0]:
//                   // View all departments
//                   return viewAllDep();

//               case commandMenuChoices[7]:
//                   // Add a department
//                   const addDepArray = await SQLquery.queryReturnResult("SELECT department.name FROM department");
//                   return addDep(addDepArray);

//               case commandMenuChoices[8]:
//                   // Delete a department
//                   const removeDepArray = await SQLquery.queryReturnResult("SELECT department.name FROM department");
//                   return removeDep(removeDepArray);
//           }
//       })
//       .catch(error => {
//           console.error('Error:', error);
//       });
// }
// // Function to display a table with all employees
// function viewAllEmp() {
//   const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name
//                  FROM employee
//                  INNER JOIN role ON role.id = employee.role_id
//                  INNER JOIN department ON department.id = role.department_id;`;

//   const empTable = new SQLquery(query);
//   empTable.generalTableQuery(mainMenu);
// }

// // Function to display a table of all employees by a chosen department
// function viewAllEmpDep(depNamesArray) {
//   const departmentNamePrompt = new InquirerFunctions(inquirerTypes[2], 'department_Name', questions.viewAllEmpByDep, depNamesArray);
  
//   inquirer.prompt(departmentNamePrompt.ask())
//       .then(userResp => {
//           const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name
//                           FROM employee
//                           INNER JOIN role ON role.id = employee.role_id
//                           INNER JOIN department ON department.id = role.department_id AND department.name = ? ;`;

//           const empByDepTable = new SQLquery(query, userResp.department_Name);
//           empByDepTable.generalTableQuery(mainMenu);
//       });
// }
// // Function to generate a table of employees by a chosen manager
// function viewAllEmpManager(managerObj, namesArr) {
//   const chosenManager = new InquirerFunctions(inquirerTypes[2], 'manager_choice', questions.searchByManager, namesArr);

//   inquirer.prompt([chosenManager.ask()])
//       .then(userChoice => {
//           console.log(`Manager Searched By: ${userChoice.manager_choice}`);

//           // Extract first and last name from the chosen manager's full name
//           const [_, lastName] = userChoice.manager_choice.split(" ", 2);

//           // Find the chosen manager's ID from the managerObj array
//           const chosenManagerID = managerObj.find(manager => manager.lastName === lastName)?.ID || 0;

//           const queryManagerSearch = `SELECT employee.last_name, employee.first_name, role.title, department.name
//                                        FROM employee
//                                        INNER JOIN role ON role.id = employee.role_id
//                                        INNER JOIN department ON department.id = role.department_id
//                                        WHERE employee.manager_id = ?`;

//           // Create an instance of SQLquery and run generalTableQuery() method
//           const managerSearch = new SQLquery(queryManagerSearch, chosenManagerID);
//           managerSearch.generalTableQuery(mainMenu);
//       })
//       .catch(error => {
//           console.error('Error:', error);
//       });
// }
// // Function to generate a table of all employees by a given role
// function viewAllEmpRole(compRoles, actionChoice) {
//   // Create an instance of InquirerFunctions and prompt the user for the role title
//   const rolePrompt = new InquirerFunctions(inquirerTypes[2], 'role_Title', questions.viewAllEmpByRole, compRoles);
//   inquirer.prompt(rolePrompt.ask())
//       .then(userResp => {
//           // SQL query to select employees by the chosen role title
//           const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name
//                           FROM employee 
//                           INNER JOIN role ON role.id = employee.role_id AND role.title = (?)
//                           INNER JOIN department ON department.id = role.department_id;`;

//           const empByRoleTable = new SQLquery(query, userResp.role_Title);
//           empByRoleTable.generalTableQuery(mainMenu);
//       })
//       .catch(error => {
//           console.error('Error:', error);
//       });
// }

// // Function to generate a table of all managers and their departments
// function viewAllManager() {
//   const query = `SELECT employee.id, employee.first_name, employee.last_name, department.name
//                   FROM employee
//                   INNER JOIN role ON role.id = employee.role_id
//                   INNER JOIN department ON department.id = role.department_id
//                   WHERE employee.id IN (SELECT employee.manager_id FROM employee);`;

//   const managerTable = new SQLquery(query);
//   managerTable.generalTableQuery(mainMenu);
// }
// // Function to handle prompts for adding, updating, or deleting an employee
// function EmpInfoPrompts(compRoles, actionChoice) {
//   const query = "SELECT id, first_name, last_name FROM employee WHERE employee.id IN (SELECT employee.manager_id FROM employee)";
  
//   connection.query(query, function (err, res) {
//       if (err) throw err;

//       const managerObjArr = res.map(manager => ({
//           ID: manager.id,
//           firstName: manager.first_name,
//           lastName: manager.last_name
//       }));

//       const managerNamesArr = res.map(manager => `${manager.first_name} ${manager.last_name}`);

//       const first_name = new InquirerFunctions(inquirerTypes[0], 'first_name', questions.addEmployee1);
//       const last_name = new InquirerFunctions(inquirerTypes[0], 'last_name', questions.addEmployee2);
//       const emp_role = new InquirerFunctions(inquirerTypes[2], 'employee_role', questions.addEmployee3, compRoles);
//       const emp_manager = new InquirerFunctions(inquirerTypes[2], 'employee_manager', questions.addEmployee4, managerNamesArr);

//       if (actionChoice == "ADD") {
//           Promise.all([first_name.ask(), last_name.ask(), emp_role.ask(), emp_manager.ask()])
//               .then(prompts => inquirer.prompt(prompts))
//               .then(emp_info => addEmp(emp_info, managerObjArr));
//       } else if (actionChoice == "VIEW BY MANAGER") {
//           viewAllEmpManager(managerObjArr, managerNamesArr);
//       } else {
//           Promise.all([first_name.ask(), last_name.ask()])
//               .then(prompts => inquirer.prompt(prompts))
//               .then(emp_info => {
//                   if (actionChoice == "UPDATE EMP ROLE") {
//                       EmpMultiplesCheck(emp_info, actionChoice, compRoles);
//                   } else if (actionChoice == "UPDATE EMP MANAGER") {
//                       EmpMultiplesCheck(emp_info, actionChoice, managerObjArr, managerNamesArr);
//                   } else {
//                       EmpMultiplesCheck(emp_info, actionChoice);
//                   }
//               });
//       }
//   });
// }
// // Function to add an employee to the database
// function addEmp(emp_info, managerObjArr) {
//   console.log("You've entered employee ADD");

//   const queryRoleIdFromTitle = "SELECT role.id FROM role WHERE role.title = ?";
//   connection.query(queryRoleIdFromTitle, [emp_info.employee_role], function (err, res) {
//       if (err) {
//           throw err;
//       }

//       const empRoleId = res[0].id;
//       const [empManagerFirstName, empManagerLastName] = emp_info.employee_manager.split(" ");
//       let empManagerID = 0;

//       // Find the manager ID from the managerObjArr
//       for (let manager of managerObjArr) {
//           if (manager.firstName === empManagerFirstName && manager.lastName === empManagerLastName) {
//               empManagerID = manager.ID;
//               break;
//           }
//       }

//       const queryInsertEmpInfo = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
//       connection.query(queryInsertEmpInfo, [emp_info.first_name, emp_info.last_name, empRoleId, empManagerID], function (err, res) {
//           if (err) {
//               throw err;
//           }
//           console.log("Employee Added");
//           mainMenu();
//       });
//   });
// }
// // Function to check for multiple instances of an employee or role
// function EmpMultiplesCheck(emp_info, actionChoice, arrayNeededForNextStep) {
//   console.log("You've entered employee multiples check");

//   const empFirstName = emp_info.first_name;
//   const empLastName = emp_info.last_name;
//   const queryMultipleEmpCheck = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, 
//                                   employee.manager_id, department.name
//                                   FROM employee 
//                                   INNER JOIN role ON role.id = employee.role_id
//                                   INNER JOIN department ON department.id = role.department_id
//                                   WHERE employee.first_name = ? AND employee.last_name = ?`;

//   connection.query(queryMultipleEmpCheck, [empFirstName, empLastName], function (err, res) {
//       if (err) {
//           throw err;
//       }

//       if (res.length > 1) {
//           console.log("Multiple Employees Found!");
//           const multipleName = res.map(employee => `${employee.id} ${employee.first_name} ${employee.last_name} ${employee.title} ${employee.name}`);
//           const which_employee_to_Delete = new InquirerFunctions(inquirerTypes[2], 'employee_delete', questions.deleteEmployee1, multipleName);

//           inquirer.prompt([which_employee_to_Delete.ask()]).then(userChoice => {
//               const chosenEmpInfo = userChoice.employee_delete.split(" ");
//               const chosenEmpID = chosenEmpInfo[0];

//               if (actionChoice === "DELETE") {
//                   deleteEmp(chosenEmpID);
//               } else if (actionChoice === "UPDATE EMP ROLE") {
//                   updateEmpRole(chosenEmpID, arrayNeededForNextStep);
//               } else if (actionChoice === "UPDATE EMP MANAGER") {
//                   updateEmpManager(chosenEmpID, arrayNeededForNextStep);
//               }
//           });

//       } else if (!res[0]) {
//           console.log("Could not find employee. Rerouted to Main Menu");
//           mainMenu();

//       } else {
//           console.log("One Employee Found!");

//           if (actionChoice === "DELETE") {
//               deleteEmp(res[0].id);
//           } else if (actionChoice === "UPDATE EMP ROLE") {
//               updateEmpRole(res[0].id, arrayNeededForNextStep);
//           } else if (actionChoice === "UPDATE EMP MANAGER") {
//               updateEmpManager(res[0].id, arrayNeededForNextStep);
//           }
//       }
//   });
// }   
// // Function to delete an employee
// function deleteEmp(firstName, lastName, employeeID) {
//   console.log("You've entered employee delete.");

//   const queryDelete = "DELETE FROM employee WHERE id = ?";
//   const confirmDelete = new InquirerFunctions(inquirerTypes[2], 'confirm_choice', questions.deleteEmployee2 + firstName + " " + lastName + "?", ["yes", "no"]);
//   const deleteQuery = new SQLquery(queryDelete, employeeID);

//   inquirer.prompt([confirmDelete.ask()]).then(respObj => {
//       if (respObj.confirm_choice === "yes") {
//           deleteQuery.delete(mainMenu);
//       } else {
//           mainMenu();
//       }
//   });
// }

// // Function to update the employee's role
// function updateEmpRole(employeeID, rolesArray) {
//   console.log("Entered update employee role.");

//   const empNewRole = new InquirerFunctions(inquirerTypes[2], 'employee_role', questions.updateRole, rolesArray);
//   const queryGetRoleId = "SELECT id FROM role WHERE title = ?";

//   inquirer.prompt([empNewRole.ask()]).then(chosenRole => {
//       connection.query(queryGetRoleId, chosenRole.employee_role, function (err, res) {
//           if (err) {
//               throw err;
//           }

//           const queryUpdateRoleId = "UPDATE employee SET role_id = ? WHERE id = ?";
//           const updateEmpRoleId = new SQLquery(queryUpdateRoleId, [res[0].id, employeeID]);

//           updateEmpRoleId.update(mainMenu, "Employee Role Updated!");
//       });
//   });
// }
// // Function to update the employee's manager
// function updateEmpManager(employeeID, managerObjectArray) {
//   console.log("Entered update employee manager.");

//   const queryCurrentManager = "SELECT manager_id FROM employee WHERE id = ?";
//   connection.query(queryCurrentManager, employeeID, function (err, res) {
//       if (err) {
//           throw err;
//       }

//       const currentManagerID = res[0].manager_id;

//       const managerChoices = managerObjectArray.filter(manager => manager.ID !== currentManagerID);
//       const possibleNewManagerNames = managerChoices.map(manager => `ID: ${manager.ID} ${manager.firstName} ${manager.lastName}`);

//       const newManagerChoice = new InquirerFunctions(inquirerTypes[2], 'new_Manager', questions.newManager, possibleNewManagerNames);

//       inquirer.prompt([newManagerChoice.ask()]).then(userChoice => {
//           const userInputSplitAtId = userChoice.new_Manager.split(" ", 2);
//           const newManagerID = userInputSplitAtId[1];

//           const queryUpdateNewManager = "UPDATE employee SET manager_id = ? WHERE id = ?";

//           connection.query(queryUpdateNewManager, [newManagerID, employeeID], function (err, res) {
//               if (err) {
//                   throw err;
//               }
//               console.log("Manager Updated!");
//               mainMenu();
//           });
//       });
//   });
// }
// // Function to view all roles
// function viewAllRoles() {
//   const query = `SELECT role.title, role.salary, department.name
//                  FROM role
//                  INNER JOIN department ON department.id = role.department_id`;
//   const roleTable = new SQLquery(query);
//   roleTable.generalTableQuery(mainMenu);
// }

// // Function to view all departments
// function viewAllDep() {
//   const query = "SELECT name FROM department";
//   const depTable = new SQLquery(query);
//   depTable.generalTableQuery(mainMenu);
// }

// // Function to add a role
// function addRole() {
//   const queryDeps = "SELECT name FROM department";
//   connection.query(queryDeps, function (err, res) {
//       if (err) throw err;

//       const depNameArr = res.map(dep => dep.name);

//       const whatRole = new InquirerFunctions(inquirerTypes[0], 'role_to_add', questions.newRole);
//       const whatSalary = new InquirerFunctions(inquirerTypes[0], 'role_salary', questions.salary);
//       const whatDepartment = new InquirerFunctions(inquirerTypes[2], 'department', questions.department, depNameArr);

//       Promise.all([whatRole.ask(), whatSalary.ask(), whatDepartment.ask()]).then(prompts => {
//           inquirer.prompt(prompts).then(userChoices => {
//               const getDepId = "SELECT id FROM department WHERE name = ?";
//               connection.query(getDepId, userChoices.department, function (err, res) {
//                   if (err) throw err;

//                   const addRolequery = "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
//                   const addRole = new SQLquery(addRolequery, [userChoices.role_to_add, userChoices.role_salary, res[0].id]);

//                   addRole.update(mainMenu, "Role added!");
//               });
//           });
//       });
//   });
// }
// function deleteRole(compRolesArr) {
//   console.log("You've entered role delete");

//   const whatRole = new InquirerFunctions(inquirerTypes[2], 'role_to_delete', questions.deleteRole, compRolesArr);
//   inquirer.prompt([whatRole.ask()]).then(userChoice => {

//       const role_id_Query = "SELECT id FROM role WHERE title = ?";
//       connection.query(role_id_Query, userChoice.role_to_delete, function (err, res) {
//           if (err) throw err;

//           const roleDeleteID = res[0].id;
//           const roleDeleteTitle = userChoice.role_to_delete;

//           // Check if more than one role exists with the given title
//           if (res.length > 1) {
//               console.log("Role found in multiple departments!");

//               const departmentsWithRolequery = `SELECT department.name, role.department_id
//                                                 FROM department
//                                                 INNER JOIN role ON role.department_id = department.id AND role.title = ?;`;

//               connection.query(departmentsWithRolequery, userChoice.role_to_delete, function (err, res) {
//                   if (err) throw err;

//                   const departmentsWithRoleArr = res.map(department => department.name);

//                   const whichDeparment = new InquirerFunctions(inquirerTypes[2], 'department_to_delete_Role_From', questions.departmentDeleteRole, departmentsWithRoleArr);

//                   inquirer.prompt([whichDeparment.ask()]).then(userChoice => {
//                       const departmentName = userChoice.department_to_delete_Role_From;
//                       const departmentID = res.find(dep => dep.name === departmentName).department_id;

//                       const deleteRoleQuery2 = "DELETE FROM role WHERE title = ? AND department_id = ?";
//                       const deleteInstance2 = new SQLquery(deleteRoleQuery2, [roleDeleteTitle, departmentID]);
//                       deleteInstance2.delete(mainMenu);
//                   });
//               });

//           } else {
//               const deleteRoleQuery = "DELETE FROM role WHERE id = ?";
//               const deleteInstance = new SQLquery(deleteRoleQuery, roleDeleteID);
//               deleteInstance.delete(mainMenu);
//           }
//       });
//   });
// }
// function addDep(depNameArr) {
//   const whatDep = new InquirerFunctions(inquirerTypes[0], 'dep_to_add', questions.newDep);

//   inquirer.prompt([whatDep.ask()]).then(userChoice => {
//       const depName = userChoice.dep_to_add;

//       // Check if the department already exists
//       const alreadyExist = depNameArr.some(department => department.name === depName);

//       if (alreadyExist) {
//           console.log("Department already exists!");
//           mainMenu();
//       } else {
//           const addDepQuery = "INSERT INTO department (name) VALUES (?);";
//           const addDep = new SQLquery(addDepQuery, depName);

//           addDep.update(mainMenu, "Department added!");
//       }
//   });
// }

// function removeDep(depNameArr) {
//   const whatDepartment = new InquirerFunctions(inquirerTypes[0], 'dep_to_delete', questions.deleteDep);

//   inquirer.prompt([whatDepartment.ask()]).then(userChoice => {
//       const depName = userChoice.dep_to_delete;

//       const deleteDepQuery = "DELETE FROM department WHERE name = (?);";
//       const deleteDep = new SQLquery(deleteDepQuery, depName);

//       deleteDep.update(mainMenu, "Department deleted!");
//   });
// }

