const glob = require('fast-glob');
const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const fg = require('fast-glob');

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function main() {
    console.log('Hello');

    let list;
    try {
        list = require('./.repo.config.js');
    } catch (err) {
        console.error('Not found!');
        // TODO: ask to download a template instead
    }

    // Prepare questions
    const questions = list.map((obj, i) => {
        const question = {
            name: String(i),
            ...obj
        };

        delete question.find;
        delete question.replace;
        delete question.glob;
        return question;
    });

    // Ask questions
    const answers = await inquirer.prompt(questions);

    for (const i of Object.keys(answers)) {
        const item = list[i];
        item.answer = answers[i];

        const findRegex = item.find instanceof RegExp ? item.find : new RegExp(escapeRegExp(item.find), 'g');

        const files = await fg(item.glob, { dot: true });
        console.log(files);
        for (const filePath of files) {
            const content = await fs.promises.readFile(filePath, 'utf8');
            const newContent = String(content).replace(findRegex, item.answer);
            await fs.promises.writeFile(filePath, newContent, 'utf8');
        }
    }
}

main();
