import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from 'react-dom';


let injectEventPluginsByName;
// from https://github.com/facebook/react/blob/v16.5.1/packages/react-dom/src/client/ReactDOM.js#L750
const secret = __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
if (secret && secret.Events && secret.Events[3]) {
  injectEventPluginsByName = secret.Events[3];
} else {
  injectEventPluginsByName = () => {
    console.warn('logrocket-react does not work with this version of React');
  }
}

export default function setupReact() {
  injectEventPluginsByName({
    ResponderEventPlugin: {
      extractEvents: (topLevelType, targetInst, nativeEvent) => {
        if (topLevelType !== 'click' || !targetInst) {
          return;
        }

        let currentElement = targetInst.return;

        const names = [];
        while (currentElement && currentElement.type) {
          const name = currentElement.type.displayName ||
            currentElement.type.name;
          if (name) {
            names.push(name);
          }
          currentElement = currentElement.return;
        }

        // eslint-disable-next-line no-param-reassign
        nativeEvent.__lrName = names;
      },
    },
  });
}
