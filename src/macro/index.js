const { createUseObserver } = require("./createUseObserver")
module.exports = createUseObserver({
    importSource: "@joenoon/mobx-react-hooks",
    importSpecifier: "useObserverInternal"
})
