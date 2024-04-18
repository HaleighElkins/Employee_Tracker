const inquirer = require("inquirer");
const Table = require('cli-table');
const { Pool } = require('pg');



const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'employee_db',
  password: '1452',
  port: 5432, 
});

// // Departments
// async function departments() {
//     try {
//       const getSql = `SELECT department.department_name AS "Department", 
//       id AS "Department ID" 
//       FROM department 
//       ORDER BY department.department_name`;
  
//       const result = await pool.query(getSql);
  
//       const table = new Table({
//         head: ['Department', 'Department ID']
//       });
  
//       console.log('');
//       result.rows.forEach(row => {
//         table.push([row['Department'], row['Department ID']]);
//       });
      
//       console.log(table.toString());
//     } catch (error) {
//       console.error('Having this issue: ', error);
//     }
//   }




// Departments
// async function departments() {
//   try {
//     const getSql = `SELECT department.department_name AS "Department", 
//     id AS "Department ID" 
//     FROM department 
//     ORDER BY department.department_name`;

//     const result = await pool.query(getSql);

//     const table = new Table({
//       head: ['Department', 'Department ID']
//     });

//     console.log('');
//     result.rows.forEach(row => {
//       table.push([row['Department'], row['Department ID']]);
//     });
    
//     console.log(table.toString());
//   } catch (error) {
//     console.error('Having this issue: ', error);
//   }
// }

async function departments() {
  try {
    const getSql = `SELECT department.department_name AS "Department", 
    id AS "Department ID" 
    FROM department 
    ORDER BY department.department_name`;
  

    const result = await pool.query(getSql);

    const table = new Table({
      head: ['Department', 'Department ID']
    });

    console.log('');
    result.rows.forEach(row => {
      table.push([row['Department'], row['Department ID']]);
    });
    
    console.log(table.toString());
  } catch (error) {
    console.error('Having this issue: ', error);
  }
}



// Function to retrieve all departments
async function getAllDepartments() {
  try {
    const result = await pool.query('SELECT id, department_name FROM department');
    return result.rows;
  } catch (error) {
    console.error('Error retrieving departments', error);
    throw error;
  }
}
  
//   Delete departments
async function deleteDepartment() {
    try {
      // Prompt user for the ID of the department to delete
      const userInput = await inquirer.prompt({
        type: "input",
        message: "Please enter the ID number of the department you would like to delete:",
        name: "deleteId"
      });
  
      // Delete the department from the database
      const deleteSql = `DELETE FROM department WHERE id = $1`;
      const result = await pool.query(deleteSql, [userInput.deleteId]);
  
      console.log('Department deleted successfully.');
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  }
  
//   Roles
async function roles() {
    try {
      const getSql = `SELECT role.title AS "Title", 
      role.id AS "Title ID", 
      department.department_name AS "Department", 
      role.salary AS "Salary" 
      FROM role 
      LEFT JOIN department ON department.id = role.dept_id 
      ORDER BY department.department_name ASC, role.title ASC`;
  
      const result = await pool.query(getSql);
  
      const table = new Table({
        head: ['Title', 'Title ID', 'Department', 'Salary']
      });
  
      console.log('');
      result.rows.forEach(row => {
        table.push([row['Title'], row['Title ID'], row['Department'], row['Salary']]);
      });
  
      console.log(table.toString());
    } catch (error) {
      console.error('Having this issue: ', error);
    }
  }
  
//   Delete roles
async function deleteRole() {
    try {
      // Display roles before prompting for deletion
      await roles();
  
      // Prompt user for the ID of the role to delete
      const userInput = await inquirer.prompt({
        type: "input",
        message: "Please enter the ID number of the role you would like to delete:",
        name: "deleteId"
      });
  
      // Delete the role from the database
      const deleteSql = `DELETE FROM role WHERE id = $1`;
      const result = await pool.query(deleteSql, [userInput.deleteId]);
  
      console.log('Role deleted successfully.');
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  }
  
//   Employees
async function employees() {
    try {
      const getSql = `SELECT employee.id AS "Employee ID", 
      employee.first_name AS "First Name", 
      employee.last_name AS "Last Name", 
      department.department_name AS "Department", 
      role.title AS "Title", 
      role.salary AS "Salary", 
      CONCAT(manager.first_name, ' ', manager.last_name) AS "Manager Name" 
      FROM employee 
      LEFT JOIN role ON role.id = employee.role_id 
      LEFT JOIN department ON department.id = role.dept_id 
      LEFT JOIN employee manager ON manager.id = employee.manager_id 
      ORDER BY department.department_name ASC, employee.last_name ASC`;
  
      const result = await pool.query(getSql);
  
      const table = new Table({
        head: ['Employee ID', 'First Name', 'Last Name', 'Department', 'Title', 'Salary', 'Manager Name']
      });
  
      console.log('');
      result.rows.forEach(row => {
        const managerName = row['Manager Name'] ? row['Manager Name'] : '';
        table.push([row['Employee ID'], row['First Name'], row['Last Name'], row['Department'], row['Title'], row['Salary'], managerName]);
      });
  
      console.log(table.toString());
    } catch (error) {
      console.error('Having this issue: ', error);
    }
  }
  
//   Delete employees
async function deleteEmployees() {
    try {
      const getSql = `SELECT employee.id AS "Employee ID", 
      employee.first_name AS "First Name", 
      employee.last_name AS "Last Name", 
      department.department_name AS "Department", 
      role.title AS "Title", 
      role.salary AS "Salary", 
      CONCAT(manager.first_name, ' ', manager.last_name) AS "Manager Name" 
      FROM employee 
      LEFT JOIN role ON role.id = employee.role_id 
      LEFT JOIN department ON department.id = role.dept_id 
      LEFT JOIN employee manager ON manager.id = employee.manager_id 
      ORDER BY department.department_name ASC, employee.last_name ASC`;
  
      const result = await pool.query(getSql);
  
      const table = new Table({
        head: ['Employee ID', 'First Name', 'Last Name', 'Department', 'Title', 'Salary', 'Manager Name']
      });
  
      console.log('');
      result.rows.forEach(row => {
        const managerName = row['Manager Name'] ? row['Manager Name'] : '';
        table.push([row['Employee ID'], row['First Name'], row['Last Name'], row['Department'], row['Title'], row['Salary'], managerName]);
      });
  
      console.log(table.toString());
    } catch (error) {
      console.error('Having this issue: ', error);
    }
  }

//   Manager for employees
async function managerEmployees() {
    try {
      // Query to get managers
      const getManagerSql = `SELECT employee.id AS "Manager ID",
        CONCAT(employee.first_name, ' ', employee.last_name) AS "Manager Name"
        FROM employee
        WHERE employee.id IN (SELECT DISTINCT manager_id FROM employee)`;
  
      const managerResult = await pool.query(getManagerSql);
      const managers = managerResult.rows.map(row => ({ name: row['Manager Name'], value: row['Manager ID'] }));
  
      // Prompt user to choose a manager
      const selectManager = [
        {
          type: "list",
          message: "Please choose a manager to see their employees.",
          name: "managerId",
          choices: managers
        }
      ];
  
      const chosenManager = await inquirer.prompt(selectManager);
      const employeesByManager = chosenManager.managerId;
  
      // Query to get employees under the chosen manager
      const getEmplSql = `SELECT employee.id AS "Employee ID", 
        employee.first_name AS "First Name", 
        employee.last_name AS "Last Name", 
        department.department_name AS "Department", 
        role.title AS "Title", 
        role.salary AS "Salary"
        FROM employee 
        LEFT JOIN role ON role.id = employee.role_id 
        LEFT JOIN department ON department.id = role.dept_id 
        WHERE employee.manager_id = $1
        ORDER BY employee.last_name ASC`;
  
      const emplResult = await pool.query(getEmplSql, [employeesByManager]);
  
      console.log('');
      const table = new Table({
        head: ['Employee ID', 'First Name', 'Last Name', 'Department', 'Title', 'Salary']
      });
  
      emplResult.rows.forEach(row => {
        table.push([row['Employee ID'], row['First Name'], row['Last Name'], row['Department'], row['Title'], row['Salary']]);
      });
  
      console.log(table.toString());
    } catch (error) {
      console.error('Having this issue: ', error);
    }
  }

//   Department for employees

async function deptEmployees() {
    try {
      // Query to get all departments
      const getDeptSql = `SELECT department.department_name AS "Department", 
        id AS "Department ID" 
        FROM department 
        ORDER BY department.department_name`;
  
      const deptResult = await pool.query(getDeptSql);
      const allDept = deptResult.rows.map(row => row.Department);
  
      // Prompt user to choose a department
      const viewByDept = [
        {
          type: "list",
          message: "Please choose the department you'd like to see.",
          name: "deptName",
          choices: allDept
        }
      ];
  
      const chosenDept = await inquirer.prompt(viewByDept);
      const deptName = chosenDept.deptName;
  
      // Query to get employees in the chosen department
      const getEmplSql = `SELECT employee.id AS "Employee ID", 
        employee.first_name AS "First Name", 
        employee.last_name AS "Last Name", 
        department.department_name AS "Department", 
        role.title AS "Title", 
        role.salary AS "Salary", 
        CONCAT(manager.first_name, ' ', manager.last_name) AS "Manager Name" 
        FROM employee 
        LEFT JOIN role ON role.id = employee.role_id 
        LEFT JOIN department ON department.id = role.dept_id 
        LEFT JOIN employee manager ON manager.id = employee.manager_id 
        ORDER BY department.department_name ASC, employee.last_name ASC`;
  
      const emplResult = await pool.query(getEmplSql);
  
      console.log('');
      const employeesInDept = emplResult.rows.filter(row => row.Department === deptName);
      const table = new Table({
        head: ['Employee ID', 'First Name', 'Last Name', 'Department', 'Title', 'Salary', 'Manager Name']
      });
  
      employeesInDept.forEach(row => {
        const managerName = row['Manager Name'] ? row['Manager Name'] : '';
        table.push([row['Employee ID'], row['First Name'], row['Last Name'], row['Department'], row['Title'], row['Salary'], managerName]);
      });
  
      console.log(table.toString());
    } catch (error) {
      console.error('Having this issue: ', error);
    }
  }
  
//   Department salary totals
async function departmentSalaryTotal() {
    try {
      // Query to get all departments
      const getDeptSql = `SELECT department.department_name AS "Department", 
        id AS "Department ID" 
        FROM department 
        ORDER BY department.department_name`;
  
      const deptResult = await pool.query(getDeptSql);
      const allDept = deptResult.rows.map(row => row.Department);
  
      // Prompt user to choose a department
      const viewByDept = [
        {
          type: "list",
          message: "Please choose the department you'd like to see.",
          name: "deptName",
          choices: allDept
        }
      ];
  
      const chosenDept = await inquirer.prompt(viewByDept);
      const deptName = chosenDept.deptName;
  
      // Query to get employees in the chosen department
      const getEmplSql = `SELECT employee.id AS "Employee ID", 
        employee.first_name AS "First Name", 
        employee.last_name AS "Last Name", 
        department.department_name AS "Department", 
        role.title AS "Title", 
        role.salary AS "Salary", 
        CONCAT(manager.first_name, ' ', manager.last_name) AS "Manager Name" 
        FROM employee 
        LEFT JOIN role ON role.id = employee.role_id 
        LEFT JOIN department ON department.id = role.dept_id 
        LEFT JOIN employee manager ON manager.id = employee.manager_id 
        ORDER BY department.department_name ASC, employee.last_name ASC`;
  
      const emplResult = await pool.query(getEmplSql);
  
      console.log('');
      const employeesInDept = emplResult.rows.filter(row => row.Department === deptName);
      let total = 0;
      employeesInDept.forEach((employee) => {
        total += parseInt(employee.Salary);
      });
  
      console.log('Total amount of money spent on employee salaries in this department is: ', total);
    } catch (error) {
      console.error('Having this issue: ', error);
    }
  }
  
//   Adding

// Add department
async function addDepartment() {
    try {
      // Prompt user for the name of the new department
      const addDept = [
        {
          type: "input",
          message: "Please enter the name of the new department.",
          name: "deptName"
        }
      ];
  
      const newDept = await inquirer.prompt(addDept);
      const deptName = newDept.deptName;
  
      // Query to insert the new department into the database
      const insertSql = `INSERT INTO department (department_name) VALUES ($1)`;
      await pool.query(insertSql, [deptName]);
  
      console.log('New department added successfully!');
    } catch (error) {
      console.error('Having this issue: ', error);
    }
  }
  
//   Add Roles
async function addRole() {
    try {
      // Query to get all departments
      const getDeptSql = `SELECT department.department_name AS "Department", department.id
        FROM department 
        ORDER BY department_name`;
  
      const result = await pool.query(getDeptSql);
      const allDept = result.rows.map(row => row.Department);
  
      // Prompt user for the details of the new role
      const addRoleQuestions = [
        {
          type: "input",
          message: "Please enter the name of the new role.",
          name: "roleName"
        },
        {
          type: "input",
          message: "Please enter the salary amount of the new role.",
          name: "roleSalary"
        },
        {
          type: "list",
          message: "Please choose what department this role is for.",
          name: "roleDept",
          choices: allDept
        }
      ];
  
      const newRole = await inquirer.prompt(addRoleQuestions);
      const chosenDept = result.rows.find(row => row.Department === newRole.roleDept);
  
      // Query to insert the new role into the database
      const insertSql = `INSERT INTO role (title, salary, dept_id) VALUES ($1, $2, $3)`;
      await pool.query(insertSql, [newRole.roleName, newRole.roleSalary, chosenDept.id]);
  
      console.log('New role added successfully!');
    } catch (error) {
      console.error('Having this issue: ', error);
    }
  }
  
//   Add Employees
async function addEmployee() {
    try {
      // Query to get all roles
      const getRoleSql = `SELECT role.title AS "Title", role.id FROM role ORDER BY title`;
      const result = await pool.query(getRoleSql);
      const allTitles = result.rows.map(row => row.Title);
  
      // Prompt user for the details of the new employee
      const addEmployeeQuestions = [
        {
          type: "input",
          message: "Please enter the first name of the new employee.",
          name: "firstName"
        },
        {
          type: "input",
          message: "Please enter the last name of the new employee.",
          name: "lastName"
        },
        {
          type: "list",
          message: "Please choose the employee's title.",
          name: "title",
          choices: allTitles
        },
        {
          type: "confirm",
          message: "Does this person have a manager?",
          name: "hasManager",
          default: true
        }
      ];
  
      const newEmployee = await inquirer.prompt(addEmployeeQuestions);
      const chosenRole = result.rows.find(row => row.Title === newEmployee.title);
  
      // If the employee has a manager, prompt for manager details
      if (newEmployee.hasManager) {
        const managerId = await promptForManagerId();
        await insertEmployeeWithManager(newEmployee, chosenRole, managerId);
      } else {
        // Insert the new employee without a manager
        const insertSql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, NULL)`;
        await pool.query(insertSql, [newEmployee.firstName, newEmployee.lastName, chosenRole.id]);
        console.log('New Employee added successfully!');
      }
    } catch (error) {
      console.error('Having this issue: ', error);
    }
  }
  
  async function promptForManagerId() {
    // Additional prompt to get the manager ID
    const managerIdQuestion = [
      {
        type: "input",
        message: "Please enter the manager's ID:",
        name: "managerId"
      }
    ];
    const managerIdResponse = await inquirer.prompt(managerIdQuestion);
    return managerIdResponse.managerId;
  }
  
  async function insertEmployeeWithManager(newEmployee, chosenRole, managerId) {
    // Insert the new employee with a manager
    const insertSql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`;
    await pool.query(insertSql, [newEmployee.firstName, newEmployee.lastName, chosenRole.id, managerId]);
    console.log('New Employee added successfully!');
  }
  
//   Add Manager 
async function addManager(newEmployee, chosenRole) {
    try {
      // Query to get all employees
      const getEmployeesSql = `SELECT employee.last_name AS "Last", employee.first_name AS "First", employee.id AS "ID"
        FROM employee ORDER BY last_name`;
  
      const result = await pool.query(getEmployeesSql);
      const allEmployees = result.rows.map(row => `${row.ID}: ${row.Last}, ${row.First}`);
  
      // Prompt user to choose the manager for the new employee
      const addManagerQuestion = [
        {
          type: "list",
          message: "Who is this person's manager?",
          name: "managerId",
          choices: allEmployees
        }
      ];
  
      const managerTrue = await inquirer.prompt(addManagerQuestion);
      const chosenManager = result.rows.find(row => row.ID.toString() === managerTrue.managerId.split(':')[0]);
  
      // Insert the new employee with the chosen manager
      const insertSql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`;
      await pool.query(insertSql, [newEmployee.firstName, newEmployee.lastName, chosenRole.id, chosenManager.ID]);
  
      console.log('New Employee added successfully!');
    } catch (error) {
      console.error('Having this issue: ', error);
    }
  }

//   Updating

// Update Employee
async function updateEmployee() {
    try {
      // Query to get all employees with their information
      const getSql = `SELECT employee.id AS "ID", 
        employee.first_name AS "First", 
        employee.last_name AS "Last", 
        department.department_name AS "Department", 
        role.title AS "Title", 
        role.salary AS "Salary", 
        CONCAT(manager.first_name, ' ', manager.last_name) AS "Manager" 
        FROM employee 
        LEFT JOIN role ON role.id = employee.role_id 
        LEFT JOIN department ON department.id = role.dept_id 
        LEFT JOIN employee manager ON manager.id = employee.manager_id 
        ORDER BY employee.last_name ASC`;
  
      const result = await pool.query(getSql);
      
      console.log('');
      const table = new Table({
        head: ['ID', 'Last', 'First', 'Department', 'Title', 'Salary', 'Manager']
      });
  
      result.rows.forEach(row => {
        const managerName = row['Manager'] ? row['Manager'] : '';
        table.push([row['ID'], row['Last'], row['First'], row['Department'], row['Title'], row['Salary'], managerName]);
      });
  
      // Map each employee's information to a display string for prompt choices
      const everyone = result.rows.map(row => `ID ${row.ID}: ${row.Last}, ${row.First} - ${row.Title} in ${row.Department}, ${row.Salary}/annually - ManagerID ${row.Manager}`);
  
      // Prompt user to choose the employee and the field to edit
      const editPerson = [
        {
          type: "list",
          message: "Please choose the employee whose information you would like to edit.",
          name: "thePerson",
          choices: everyone
        },
        {
          type: "list",
          message: "What would you like to edit?",
          name: "value",
          choices:  ["Last", "First", "Title", "Manager"]
        }
      ];
  
      const chosenEmployee = await inquirer.prompt(editPerson);
      const chosenEmployeeId = parseInt(chosenEmployee.thePerson.split(' ')[1]);
      const employeeToEdit = result.rows.find(row => row.ID === chosenEmployeeId);
  
      if (employeeToEdit) {
        const editOptions = {
          Last: "last_name",
          First: "first_name",
          Title: "role_id",
          Manager: "manager_id"
        };
  
        // Prompt user to enter the updated information
        const userResponse = await inquirer.prompt({
          type: "input",
          message: `Enter new ${editOptions[chosenEmployee.value]}:`,
          name: "updatedInfo"
        });
  
        // Update the employee information in the database
        const updateSql = `UPDATE employee SET ${editOptions[chosenEmployee.value]} = $1 WHERE id = $2`;
        await pool.query(updateSql, [userResponse.updatedInfo, employeeToEdit.ID]);
  
        console.log('Employee updated successfully!');
      } else {
        console.log('Employee not found');
      }
    } catch (error) {
      console.error('Having this issue: ', error);
    }
  }
  
// -----------------------------------------------------
// Debugging
// Get Employees
async function getEmployees() {
  // Function implementation...
}

// Export all functions
module.exports = { 
  getAllDepartments,
  departments: departments,
  departments,
  deleteDepartment,
  roles,
  deleteRole,
  getEmployees,
  deleteEmployees, 
  managerEmployees,
  deptEmployees,
  departmentSalaryTotal,
  addDepartment,
  addRole,
  addEmployee,
  addManager,
  updateEmployee
};
// -----------------------------------------------
  // module.exports = { updateEmployee };
  