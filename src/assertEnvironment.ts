import { spy } from "mobx"
import { useState } from "react"

if (!useState) {
    throw new Error("@joenoon/mobx-react-hooks requires React with Hooks support")
}
if (!spy) {
    throw new Error("@joenoon/mobx-react-hooks requires mobx at least version 4 to be available")
}
