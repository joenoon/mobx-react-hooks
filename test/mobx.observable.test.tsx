import * as mobx from "mobx"
import * as React from "react"
import { act, cleanup, fireEvent, render } from "react-testing-library"

import { useObserver } from "./local.macro"

afterEach(cleanup)

describe("is used to keep observable within component body", () => {
    it("value can be changed over renders", () => {
        const TestComponent = () => {
            useObserver()
            const [obs] = React.useState(() =>
                mobx.observable({
                    x: 1,
                    y: 2
                })
            )
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

            const [obs] = React.useState(() =>
                mobx.observable({
                    x: 1,
                    y: 2
                })
            )
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
            const [obs] = React.useState(() =>
                mobx.observable(
                    {
                        x: 1,
                        y: 2,
                        inc() {
                            this.x += 1
                        }
                    },
                    {
                        inc: mobx.action.bound
                    }
                )
            )
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
            const [obs] = React.useState(() =>
                mobx.observable({
                    x: 1,
                    y: 2,
                    get z() {
                        return this.x + this.y
                    }
                })
            )
            return <div onClick={() => (obs.x += 1)}>{obs.z}</div>
        }
        const { container } = render(<TestComponent />)
        const div = container.querySelector("div")!
        expect(div.textContent).toBe("3")
        fireEvent.click(div)
        expect(div.textContent).toBe("4")
    })

    it("keeps track of observable values", () => {
        const TestComponent = (props: any) => {
            useObserver()
            const [state] = React.useState(() =>
                mobx.observable({
                    get value() {
                        return props.store.x + 5 * props.store.y
                    }
                })
            )
            return <div>{state.value}</div>
        }
        const store = mobx.observable({ x: 5, y: 1 })
        const { container } = render(<TestComponent store={store} />)
        const div = container.querySelector("div")!
        expect(div.textContent).toBe("10")
        act(() => {
            store.y = 2
        })
        expect(div.textContent).toBe("15")
        act(() => {
            store.x = 10
        })
        expect(div.textContent).toBe("20")
    })
})
