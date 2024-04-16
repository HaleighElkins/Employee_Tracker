const inquirer = require('inquirer');
const {
  departments,
  deleteDepartment,
  roles,
  deleteRole,
  employees,
  deleteEmployee,
  managerEmployees,
  deptEmployees,
  departmentSalaryTotal,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployee
} = require('./assets/functions');

const userChoices = [
  "View all departments",
  "View all roles",
  "View all employees",
  "View all employees under specified manager",
  "View all employees in specified department",
  "View salary total in a department",
  "Add a role",
  "Add a department",
  "Add an employee",
  "Update an employee role",
  "Delete a role",
  "Delete a department",
  "Delete an employee"
];

const userPrompt = {
  type: "list",
  message:'\nPlease choose from the following to access and edit the data.',
  name: "userChoice",
  choices: userChoices
};

const actionMap = {
  "View all departments": departments,
  "View all roles": roles,
  "View all employees": employees,
  "View all employees under specified manager": managerEmployees,
  "View all employees in specified department": deptEmployees,
  "View salary total in a department": departmentSalaryTotal,
  "Add a department": addDepartment,
  "Add a role": addRole,
  "Add an employee": addEmployee,
  "Update an employee role": updateEmployee,
  "Delete a department": deleteDepartment,
  "Delete a role": deleteRole,
  "Delete an employee": deleteEmployee
};

function init() {
  inquirer.prompt(userPrompt)
  .then((userInput) => {
    const userInputLowerCase = userInput.userChoice; // Remove toLowerCase() conversion
    const action = actionMap[userInputLowerCase];
    if (action) {
      action();
    } else {
      console.log("Invalid choice.");
    }
  });
}


init();

module.exports = { init };
