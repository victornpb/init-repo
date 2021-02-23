#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const glob = require('fast-glob');
const inquirer = require('inquirer');
const fg = require('fast-glob');

const CONFIG_FILE = '.repo.config.js';

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function main() {
    console.log('Hello');

    let WORKING_DIR = process.cwd();

    const configFilePath = path.join(WORKING_DIR, CONFIG_FILE);

    let config;
    try {
        config = require(configFilePath);
    } catch (err) {
        console.error(`Could not find '${configFilePath}' in the current directory!`);
        return;
        // TODO: ask to download a template instead
    }

    // Ask questions
    let answers;
    if (config.questions) {
        answers = await inquirer.prompt(config.questions);
    }

    // find replace
    for (const item of config.findReplace) {

        const findRegex = (item.find instanceof RegExp) ? item.find : new RegExp(escapeRegExp(item.find), 'g');

        const files = await fg(item.glob || '**', {
            dot: true,
            onlyFiles: true,
            ignore: [
                CONFIG_FILE,
                'node_modules',
            ].concat(item.ignore).filter(Boolean)
        });

        for (const filePath of files) {
            const content = await fs.promises.readFile(filePath, 'utf8');
            const newContent = String(content).replace(findRegex, (match, ...groups) => {
                if (typeof item.replace === 'function') {
                    const variables = answers;
                    const file = {
                        path: filePath,
                        content: content,
                    };
                    return item.replace(match, groups, variables, file);
                }
                else {
                    return item.replace.replace(/\$(\w+)/, (m, v) => answers[v] || groups[v] || m);
                }
            });

            if (content !== newContent) {
                await fs.promises.writeFile(filePath, newContent, 'utf8');
            }
        }
    }

    // rename
    if (config.rename) {
        for (const item of config.rename) {
            // TODO:
        }
    }
}

main();
