module.exports = {
    questions: [
        {
            name: 'projectName',
            message: "Name of the project (kebab-case)",
            default: 'foo-bar',
            validate: Boolean,
        },
        {
            name: "reponame",
            message: 'Repository Name (snake-case)',
            validate: Boolean,
        },
        {
            name: 'userName',
            message: "Github username/organization",
            validate: Boolean,
        }
    ],
    findReplace: [
        {
            find: 'foo-bar',
            replace: '$projectName',
            glob: '**'
        },
        {
            find: 'username',
            replace: '$userName',
            glob: '**'
        },
        {
            find: '2019',
            replace: () => Date.now()
        }
    ],
}