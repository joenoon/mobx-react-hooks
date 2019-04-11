const { createUseObserver } = require("../macro/createUseObserver")
module.exports = createUseObserver({
    importSource: "../src/useObserverInternal",
    importSpecifier: "useObserverInternal"
})
