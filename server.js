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



const userPrompt = {
  type: "list",
  message:'\nPlease choose from the following to access and edit the data.',
  name: "userChoice",
  choices: [
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
  ]
};

function init() {
  inquirer.prompt(userPrompt)
  .then((userInput) => {
    const userChoice = userInput.userChoice.trim(); // Trim the user input
    console.log("User choice:", userChoice);

    switch(userChoice) {
      case "View all departments":
        departments();
        break;
      case "View all roles":
        roles();
        break;
      case "View all employees":
        employees();
        break;
      case "View all employees under specified manager":
        managerEmployees();
        break;
      case "View all employees in specified department":
        deptEmployees();
        break;
      case "View salary total in a department":
        departmentSalaryTotal();
        break;
      case "Add a department":
        addDepartment();
        break;
      case "Add a role":
        addRole();
        break;
      case "Add an employee":
        addEmployee();
        break;
      case "Update an employee role":
        updateEmployee();
        break;
      case "Delete a role":
        deleteRole();
        break;
      case "Delete a department":
        deleteDepartment();
        break;
      case "Delete an employee":
        deleteEmployee();
        break;
      default:
        console.log("Invalid choice.");
    }
  });
}

init();

module.exports = { init };
