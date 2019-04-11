# @joenoon/mobx-react-hooks <!-- omit in toc -->

[![Join the chat at https://gitter.im/mobxjs/mobx](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/mobxjs/mobx?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This is a hooks-specific iteration of [mobx-react](https://github.com/mobxjs/mobx-react).

**You need React version 16.8.0 and above**

Class based components **are not supported**. If you want to transition existing projects from classes to hooks (as most of us do), you can use this package alongside the [mobx-react](https://github.com/mobxjs/mobx-react) just fine.

Project is written in TypeScript and provides type safety out of the box. No Flow Type support is planned at this moment, but feel free to contribute.

-   [API documentation](#api-documentation)
    -   [useObserver](#useobserver)
    -   [useObservable](#useobservable)
    -   [useComputed](#usecomputed)
-   [Server Side Rendering with `useStaticRendering`](#server-side-rendering-with-usestaticrendering)

## API documentation

## useObserver

`useObserver<T>(baseComponentName = "observed", options?: IUseObserverOptions): T`

Think of `useObserver` like you would think of `observer` from mobx-react, just with different syntax for hooks.

```tsx
// useObserver comes from the macro
import { useObserver } from "@joenoon/mobx-react-hooks/macro"

// other hooks come as normal from the main library
import { useObservable } from "@joenoon/mobx-react-hooks"

const Person = props => {
    useObserver()
    const person = useObservable({ name: "John" })
    return (
        <div>
            {person.name}
            <button onClick={() => (person.name = "Mike")}>No! I am Mike</button>
        </div>
    )
}
```

The macro solves a few problems:

-   Hooks style code structure with less verbosity than alternatives.
-   Without the macro, the code necessary to please the eslint rules of hooks is verbose.
-   If you use `observer(props => ...break a hook rule)` you will not be warned - you may think you've done everything correctly until you eventually realize the linter is not analyzing these for you.
-   By sticking to this simple pattern for components that handle observable data you can avoid many pitfalls related to expecting reactions in scopes that are not under observation. The macro enforces expected behavior.

### useObservable

`useObservable<T>(initialValue: T | (() => T)): T`

React hook that creates an observable. Should almost always be preceeded by `useObserver` so the component will react to changes. Gets all the benefits from [observable objects](https://mobx.js.org/refguide/object.html) including computed properties and methods. You can also use arrays, Map, Set, or a lazy initial state function.

```tsx
import { useObserver } from "@joenoon/mobx-react-hooks/macro"
import { useObservable } from "@joenoon/mobx-react-hooks"

const TodoList = () => {
    useObserver()
    const todos = useObservable(new Map<string, boolean>())
    const todoRef = React.useRef()
    const addTodo = React.useCallback(() => {
        todos.set(todoRef.current.value, false)
        todoRef.current.value = ""
    }, [])
    const toggleTodo = React.useCallback((todo: string) => {
        todos.set(todo, !todos.get(todo))
    }, [])

    return (
        <div>
            {Array.from(todos).map(([todo, done]) => (
                <div onClick={() => toggleTodo(todo)} key={todo}>
                    {todo}
                    {done ? " ✔" : " ⏲"}
                </div>
            ))}
            <input ref={todoRef} />
            <button onClick={addTodo}>Add todo</button>
        </div>
    )
}
```

Note that if you want to track a single scalar value (string, number, boolean), you would need [a boxed value](https://mobx.js.org/refguide/boxed.html) which is not recognized by `useObservable`. However, you can simply create a "state" observable and then mutate `state`, like so:

```tsx
...
const state = useObservable({ myScalar: 1 })
...
```

### useComputed

`useComputed(func: () => T, inputs: ReadonlyArray<any> = []): T`

Another React hook that simplifies computational logic. Should always be preceeded by `useObserver` so it is tracked over renders. It's just a tiny wrapper around [MobX computed](https://mobx.js.org/refguide/computed-decorator.html#-computed-expression-as-function) function that runs computation whenever observable values change.

```tsx
import { useObserver } from "@joenoon/mobx-react-hooks/macro"
import { useObservable, useComputed } from "@joenoon/mobx-react-hooks"
const Calculator = ({ hasExploded }: { hasExploded: boolean }) => {
    useObserver()
    const inputRef = React.useRef()
    const inputs = useObservable([1, 3, 5])
    const result = useComputed(
        () => (hasExploded ? "💣" : inputs.reduce(multiply, 1) * Number(!hasExploded)),
        [hasExploded]
    )

    return (
        <div>
            <input ref={inputRef} />
            <button onClick={() => inputs.push(parseInt(inputRef.current.value) | 1)}>
                Multiply
            </button>
            <div>
                {inputs.join(" * ")} = {result}
            </div>
        </div>
    )
}
```

Notice that since the computation depends on non-observable value, it has to be passed as a second argument to `useComputed`. There is [React `useMemo`](https://reactjs.org/docs/hooks-reference.html#usememo) behind the scenes and all rules applies here as well except you don't need to specify dependency on observable values.

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
