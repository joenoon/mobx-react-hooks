import { observable } from "mobx"
import { useState } from "react"

type SupportedValues = object | Map<any, any> | any[]

export function useObservable<T extends SupportedValues>(initialValue: T | (() => T)): T {
    const fn = () =>
        observable(typeof initialValue === "function" ? (initialValue as any)() : initialValue)
    return useState(fn)[0]
}
