import * as mobx from "mobx"
import * as React from "react"
import { cleanup, fireEvent, render } from "react-testing-library"

import { useObservable } from "../src"
import { useObserver } from "./local.macro"

afterEach(cleanup)

describe("is used to keep observable within component body", () => {
    it("value can be changed over renders", () => {
        const TestComponent = () => {
            useObserver()
            const obs = useObservable({
                x: 1,
                y: 2
            })
            return (
                <div onClick={() => (obs.x += 1)}>
                    {obs.x}-{obs.y}
                </div>
            )
        }
        const { container } = render(<TestComponent />)
        const div = container.querySelector("div")!
        expect(div.textContent).toBe("1-2")
        fireEvent.click(div)
        expect(div.textContent).toBe("2-2")
    })

    it("works with observer as well", () => {
        const spyObservable = jest.spyOn(mobx, "observable")

        let renderCount = 0

        const TestComponent = () => {
            useObserver()
            renderCount++

            const obs = useObservable({
                x: 1,
                y: 2
            })
            return (
                <div onClick={() => (obs.x += 1)}>
                    {obs.x}-{obs.y}
                </div>
            )
        }
        const { container } = render(<TestComponent />)
        const div = container.querySelector("div")!
        expect(div.textContent).toBe("1-2")
        fireEvent.click(div)
        expect(div.textContent).toBe("2-2")
        fireEvent.click(div)
        expect(div.textContent).toBe("3-2")

        // though render 3 times, mobx.observable only called once
        expect(renderCount).toBe(3)
        expect(spyObservable.mock.calls.length).toBe(1)

        spyObservable.mockRestore()
    })

    it("actions can be used", () => {
        const TestComponent = () => {
            useObserver()
            const obs = useObservable({
                x: 1,
                y: 2,
                inc() {
                    obs.x += 1
                }
            })
            return (
                <div onClick={obs.inc}>
                    {obs.x}-{obs.y}
                </div>
            )
        }
        const { container } = render(<TestComponent />)
        const div = container.querySelector("div")!
        expect(div.textContent).toBe("1-2")
        fireEvent.click(div)
        expect(div.textContent).toBe("2-2")
    })

    it("computed properties works as well", () => {
        const TestComponent = () => {
            useObserver()
            const obs = useObservable({
                x: 1,
                y: 2,
                get z(): number {
                    return obs.x + obs.y
                }
            })
            return <div onClick={() => (obs.x += 1)}>{obs.z}</div>
        }
        const { container } = render(<TestComponent />)
        const div = container.querySelector("div")!
        expect(div.textContent).toBe("3")
        fireEvent.click(div)
        expect(div.textContent).toBe("4")
    })

    it("Map can used instead of object", () => {
        const TestComponent = () => {
            useObserver()
            const map = useObservable(new Map([["initial", 10]]))
            return (
                <div onClick={() => map.set("later", 20)}>
                    {Array.from(map).map(([key, value]) => (
                        <div key={key}>
                            {key} - {value}
                        </div>
                    ))}
                </div>
            )
        }
        const { container } = render(<TestComponent />)
        const div = container.querySelector("div")!
        expect(div.textContent).toBe("initial - 10")
        fireEvent.click(div)
        expect(div.textContent).toBe("initial - 10later - 20")
    })

    it("Lazy initial state function can used instead of object", () => {
        const TestComponent = () => {
            useObserver()
            const state = useObservable(() => ({ initial: 10, later: 0 }))
            return (
                <div onClick={() => (state.later = 20)}>
                    {state.initial},{state.later}
                </div>
            )
        }
        const { container } = render(<TestComponent />)
        const div = container.querySelector("div")!
        expect(div.textContent).toBe("10,0")
        fireEvent.click(div)
        expect(div.textContent).toBe("10,20")
    })
})
