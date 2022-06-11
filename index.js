const fs = require('fs');
const inquire = require('inquirer');
const Engineer = require('./lib/engineer');
const Manager = require('./lib/manager');
const Intern = require('./lib/intern');
const renderHtml = require('./lib/htmlrender');
const renderCss = require('./lib/cssrender');

const teamMembers = [];

const isValid = (value) => {
    if (value === "") {
        return "Please type in an answer";
    } else {
        return true;
    }
}

const questions = [{
        type: "list",
        message: "Choose the role of the employee:",
        choices: ["Manager", "Intern", "Engineer"],
        name: "employee",
    },
    {
        type: "input",
        message: "What is the name of the employee?",
        name: "employeeName",
        validate: isValid
    },
    {
        type: "input",
        message: "What is the ID for the employee?",
        name: "id",
        validate: isValid
    },
    {
        type: "input",
        message: "What is the email for the employee?",
        name: "email",
        validate(value) {
            const pass = value.includes("@");
            if (pass) {
                return true;
            } else {
                return "Please enter a valid email";
            }
        }
    },
    {
        type: "input",
        message: "What is the office number for the manager?",
        name: "officeNumber",
        validate: isValid,
        when: (answer) => answer.employee === "Manager"
    },
    {
        type: "input",
        message: "What is the github for the engineer?",
        name: "github",
        validate: isValid,
        when: (answer) => answer.employee === "Engineer"
    },
    {
        type: "input",
        message: "What is the school of the intern?",
        name: "school",
        validate: isValid,
        when: (answer) => answer.employee === "Intern"
    },
    {
        type: "list",
        message: "Add a member or quit?",
        choices:["Add member", "Quit"],
        name: "isFinished"
    }
];


function generateIntern(data) {
    const intern = new Intern(data.employeeName, data.id, data.email, data.school);
    teamMembers.push(intern);
}

function generateEngineer(data) {
    const engineer = new Engineer(data.employeeName, data.id, data.email, data.github);
    teamMembers.push(engineer);
}

function generateManager(data) {
    const manager = new Manager(data.employeeName, data.id, data.email, data.officeNumber);
    teamMembers.push(manager);
}

function writeHtml(html) {
    fs.writeFile('./dist/index.html', html, (err) => {
        err ? console.error(err) : console.log("HTML generated!")
    })
}

function writeCss(css) {
    fs.writeFile('./dist/style.css', css, (err) => {
        err ? console.error(err) : console.log("CSS generated!")
    })
}

function decideEmployee(data) {
    switch (data.employee) {
        case "Manager": {
            generateManager(data);
            break;
        }
        case "Engineer": {
            generateEngineer(data);
            break;
        }
        case "Intern": {
            generateIntern(data);
            break;
        }
    }
}

function employeeAnswers() {
    inquire
        .prompt(questions)
        .then((response => {
            if (response.isFinished === "Quit") {
                decideEmployee(response);
                writeCss(renderCss());
                writeHtml(renderHtml(teamMembers));
            } else {
                decideEmployee(response);
                employeeAnswers();
            }

        }));
}

function init() {
    employeeAnswers();
}

init();