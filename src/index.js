import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from 'react-dom';


let injectEventPluginsByName;
// from https://github.com/facebook/react/blob/v16.5.1/packages/react-dom/src/client/ReactDOM.js#L750
const secret = __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

console.log(secret);
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
      extractEvents: function logRocketReactEventHook(topLevelType, fiberNode, nativeEvent) {
        try {
          if (topLevelType !== 'click' || !fiberNode || !nativeEvent) {
            return;
          }

          console.log('Args:', arguments);

          let currentElement = fiberNode;

          const names = [];
          while (currentElement) {
            var name = typeof currentElement.elementType === 'function' && currentElement.elementType.displayName;
            if (currentElement.elementType) {
              console.log(currentElement.elementType.displayName);
            }
            if (name) {
              names.push(name);
            }
            currentElement = currentElement.return;
          }
          // eslint-disable-next-line no-param-reassign
          console.log('Names:', names);
          nativeEvent.__lrName = names;
        } catch (error) {
          console.error(error);
          console.error('logrocket-react caught an error while hooking into React. Please make sure you are using the correct version of logrocket-react for your version of react-dom.')
        }
      },
    },
  });
}
