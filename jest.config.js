module.exports = {
    transform: { "\\.(js|ts)x?$": "./jest.transform.js" },
    testEnvironment: "jsdom",
    setupFilesAfterEnv: [require.resolve("./jest.setup.js")],
    verbose: false,
    coverageDirectory: "coverage"
}
