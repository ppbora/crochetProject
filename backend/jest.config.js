module.exports = {
    testEnvironment: 'node',
    preset: "ts-jest",
    testMatch: "**/*.test.ts",
    reporters: [
        "default",
        ["./node_modules/jest-html-reporter",{
            pageTitle: "Test Report",
            includeFailureMsg: true,
            includeConsoleLog: true,
            sort: "TitleAsc"
        }]
    ]
}