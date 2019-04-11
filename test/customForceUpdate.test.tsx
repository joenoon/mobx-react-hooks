import { observable } from "mobx"
import * as React from "react"
import { act, cleanup, render } from "react-testing-library"
import { IUseObserverOptions, useForceUpdate } from "../src"
import { useObserver } from "./local.macro"

afterEach(cleanup)

it("a custom force update method can be used", () => {
    let x = 0

    function useCustomForceUpdate() {
        const update = useForceUpdate()
        return () => {
            x++
            update()
        }
    }
    const opts: IUseObserverOptions = {
        useForceUpdate: useCustomForceUpdate
    }

    const obs = observable.box(0)

    const TestComponent = () => {
        useObserver(undefined, opts)
        return <div>{obs.get()}</div>
    }

    render(<TestComponent />)
    expect(x).toBe(0)
    act(() => {
        obs.set(1) // the custom force update should be called here
    })
    expect(x).toBe(1)
})
