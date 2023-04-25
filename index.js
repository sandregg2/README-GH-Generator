const inquirer = require('inquirer');
// const generateMarkdown = require('./utils/generateMarkdown.js');
const fs = require('fs');
const generateReadme = require('./utils/generateMarkdown.js');
// const { resolve } = require('path');

// array of questions for user
const prompts = [
    {
        type: "input",
        name: "title",
        message: "Enter the title of your project.",
        default: '',
        validate: nameInput => {
            if (nameInput) {
                return true;
            } else {
                console.log('You need to enter a project name!');
                return false;
            }
        }
    },
    {
        type: "input",
        name: "description",
        message: "Describe your project: ",
        default: '',
    },
    {
        type: "input",
        name: "installation",
        message: "What are the steps required to install your project.",
        default: '',
    },
    { 
        type: "input", 
        name: "usage",
        message: "Provide instructions and examples for use.", 
        default: '',
    },
    {
        type: "input",
        name: "contributing",
        message: "List your collaborators, if any, with links to their GitHub profiles.",
        default: '',
    },
    {
        type: "input",
        name: "tests",
        message: "Link test files.", 
        default: '', 
    },
    {
        type: "confirm",
        name: "license",
        message: "Does your GitHub apppliation have a license? (ReadMe Generator will find it)",
        default: false,
    },
    {
        type: "input",
        name: "github",
        message: "Enter your GitHub username.",
        validate: githubInput => {
            if (githubInput) {
                return true;
            } else {
                console.log('You need to enter your GitHub username!');
                return false;
            }
        }
    },
    {
        type: "input",
        name: "repo",
        message: "Enter your GitHub repo name.",
        default: '',
        validate: repoInput => {
            if (repoInput) {
                return true;
            } else {
                console.log('You need to enter your GitHub repo name!');
                return false;
            }
        }
    },
    {
        type: "input",
        name: "email",
        message: "Enter your email.",
        default: '',
    },
]

const promptUser = async () => { // async function to prompt user
    let dataObject = {};
    for (let i = 0; i < prompts.length; i++) {
        await inquirer.prompt(
            prompts[i]
        ).then(data => {
            if (data[prompts[i].name]) { 
                dataObject[prompts[i].name] = data[prompts[i].name];
            }
        })
    }
    return dataObject;
};

// function to write README file
const writeToFile = async data => {
    const markdown = await generateReadme(data);
    console.log("in writeToFile")
    return new Promise((resolve, reject) => {
        fs.writeFile('./dist/README.md', markdown, err => {
            if (err) {
                reject(err);
                return;
            }
            resolve({
                ok: true,
                message: 'File created!'
            });
        });
    });
}

// function to initialize program
const init = () => {
    return promptUser();
}

// function call to initialize program
const failureCallback = (err) => {
    console.log(`Error : ${err}`);
}

// function call to initialize program
init()
    .then(data => { writeToFile(data) }, failureCallback)
