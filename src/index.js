import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from 'react-dom';


// from https://github.com/facebook/react/blob/v16.5.1/packages/react-dom/src/client/ReactDOM.js#L750
const injectEventPluginsByName = __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.Events[3];

export default function setupReact() {
  injectEventPluginsByName({
    ResponderEventPlugin: {
      extractEvents: (topLevelType, targetInst, nativeEvent) => {
        if (topLevelType !== 'click' || !targetInst) {
          return;
        }

        let currentElement = targetInst._debugOwner;

        const names = [];
        while (currentElement) {
          const name = currentElement.type.displayName ||
            currentElement.type.name;
          if (name) {
            names.push(name);
          }
          currentElement = currentElement._debugOwner;
        }

        // eslint-disable-next-line no-param-reassign
        nativeEvent.__lrName = names;
      },
    },
  });
}
