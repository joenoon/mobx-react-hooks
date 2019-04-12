# @joenoon/mobx-react-hooks <!-- omit in toc -->

[![Join the chat at https://gitter.im/mobxjs/mobx](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/mobxjs/mobx?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This is a hooks-specific iteration of [mobx-react](https://github.com/mobxjs/mobx-react).

**You need React version 16.8.0 and above**

Class based components **are not supported**. If you want to transition existing projects from classes to hooks (as most of us do), you can use this package alongside the [mobx-react](https://github.com/mobxjs/mobx-react) just fine.

-   [useObserver](#useobserver)
-   [Server Side Rendering`](#server-side-rendering-with-usestaticrendering)

## useObserver

`useObserver<T>(baseComponentName = "observed", options?: IUseObserverOptions): T`

Think of `useObserver` like you would think of `observer` from mobx-react, just with different syntax for hooks.

Here is an example with common usage. Note the use of `useObserver` and that everything else is plain MobX:

```tsx
import { useState } from "react"
import { useObserver } from "@joenoon/mobx-react-hooks/macro"
import { observable, action } from "mobx"

const Person = props => {
    useObserver()
    const [person] = useState(() =>
        observable(
            {
                firstName: "John",
                lastName: "FooBar",

                // becomes a computed
                get name() {
                    return `${this.lastName}, ${this.firstName}`
                },

                // becomes an action, bound below
                reset() {
                    this.firstName = "John"
                    this.lastName = "FooBar"
                }
            },
            {
                reset: action.bound
            }
        )
    )
    return (
        <div>
            {person.name}
            <button onClick={() => (person.firstName = "Mike")}>No! I am Mike</button>
            <button onClick={person.reset}>Reset</button>
        </div>
    )
}
```

The macro solves a few problems:

-   Hooks style code structure with less verbosity than alternatives.
-   Without the macro, the code necessary to please the eslint rules of hooks is verbose.
-   If you use `observer(props => ...break a hook rule)` you will not be warned - you may think you've done everything correctly until you eventually realize the linter is not analyzing these for you.
-   By sticking to this simple pattern for components that handle observable data you can avoid many pitfalls related to expecting reactions in scopes that are not under observation. The macro enforces expected behavior.

## Server Side Rendering with `useStaticRendering`

When using server side rendering, the components are rendered only once.
Since components are never unmounted, `observer` components would in this case leak memory when being rendered server side.
To avoid leaking memory, call `useStaticRendering(true)` when using server side rendering which essentially disables observer.

```js
import { useStaticRendering } from "@joenoon/mobx-react-hooks"

useStaticRendering(true)
```

This makes sure the component won't try to react to any future data changes.

## Prior Works

This project is a fork of [mobx-react-lite](https://github.com/mobxjs/mobx-react-lite) which offers various ways of doing things. The intention with this library is to offer one clear and concise pattern for using mobx with React Hooks.
