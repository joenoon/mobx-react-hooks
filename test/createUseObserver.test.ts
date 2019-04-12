// @ts-ignore
import plugin from "babel-plugin-macros"
// @ts-ignore
import pluginTester from "babel-plugin-tester"

pluginTester({
    plugin,
    snapshot: true,
    babelOptions: { filename: __filename },
    tests: [
        `
      import {useObserver} from '../src/macro'

      export const MyComponent = (props) => {
        useObserver();
        const foo = 1;
        const bar = 2;
        return null;
      };

      export const MyComponent2 = (props) => {
        // a comment
        useObserver();
        const foo = 1;
        return null;
      };

      export const MyComponent3 = (props) => {
        useObserver();
        return null;
      };

      export const MyComponent4 = (props) => {
        useObserver('baseComponentName');
        return null;
      };

      export const MyComponent5 = (props) => {
        useObserver('baseComponentName', { useForceUpdate: true });
        return null;
      };

      export const MyComponent6 = (props) => {

        useObserver();
        const foo = 1;
        return null;
      };
      `,
        {
            error: true,
            code: `
      import {useObserver} from '../src/macro'

      export const MyComponent7 = (props) => {
        dontDoThis();
        useObserver();
        const foo = 1;
        return null;
      };
      `
        }
    ]
})
