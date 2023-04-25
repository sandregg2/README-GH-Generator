const fetch = require("node-fetch");
function renderBadges(username, repo, license) {
  let ret = ""
  ret += ` 
![Analysis](https://img.shields.io/github/languages/top/${username}/${repo})`
  if (license) {
    ret += `
![License](https://img.shields.io/github/license/${username}/${repo})
  `
  }
  return ret
}
// TODO: Create a function that returns a license badge based on which license is passed in
const generateLicenseSection = async (github, repo) => {
  let ret = ""
  await fetch("https://api.github.com/repos/" + github + "/" + repo)
    .then(async response => {
      if (response.ok) {
        await response.json()
          .then(async data => {
            ret += await data.license.name
          });
      };
    });
    return ret;
}

// TODO: Create a function to generate markdown for README
const generateMarkdown = async data => {
  console.log("GENERATE MARKDOWN!")
  console.log(data)

  let addSections = "";

  // TITLE (REQUIRED)
  if (data.title) { 
    addSections += `# ${data.title}
`
  }

  // REPO LINK (GITHUB REQUIRED)
  if (data.github && data.title) { 
    addSections += `
https://github.com/${data.github}
`
  }
  
  // REPO BADGES
  addSections += `${renderBadges(data.github, data.repo, data.license)}`

  // DESCRIPTION
  if (data.description) {
    addSections += `
## Description
${data.description}
`
  }

  // TABLE OF CONTENTS
  addSections += tableOContents(data)

  // INSTALLATION
  if (data.installation) {
    addSections += `
## Installation
${data.installation}
`
  }

  // USAGE
  if (data.usage) {
    addSections += `
## Usage
${data.usage}
`
  }

  // LICENSE
  if (data.license) { 

    addSections += `
## License
This application is covered under the ${await generateLicenseSection(data.github, data.repo)} 
`
    console.log(await generateLicenseSection(data.github, data.repo))
  }

  // CONTRIBUTING
  if (data.contributing) {
    addSections += `
## Contributing
${data.contributing}
`
  }

  // TESTS
  if (data.tests) {
    addSections += `
## Tests
${data.tests}
`
  }
  // QUESTIONS
  if (data.email) {
    addSections += `
## Questions
If there are any additional questions send me an email! 

${data.email}
`
  }
  console.log(addSections)
  return addSections
};

// TABLE OF CONTENTS
function tableOContents(data) {
  const content = (Object.entries(data))
  let ret = "";
  let i = 2; 
  ret += `
## Table of Contents`
  while (content[i][0] != 'github') {
    let header = content[i][0].charAt(0).toUpperCase() + content[i][0].slice(1);
    ret += `
* [${header}](#${content[i][0]})`
    i++;
  }
  ret += `
* [Questions](#questions)
`
  return ret;
}

module.exports = generateMarkdown;