import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from 'react-dom';

const hub = __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.EventPluginHub;

export default function setupReact() {
  hub.injection.injectEventPluginsByName({
    'ResponderEventPlugin': {
      extractEvents: (topLevelType, targetInst, nativeEvent) => {
        if (topLevelType !== 'topClick' || !targetInst) {
          return;
        }

        let currentElement = targetInst._currentElement._owner;

        const names = [];
        while (currentElement) {
          const name = currentElement._currentElement.type.displayName ||
            currentElement._currentElement.type.name;
          if (name) {
            names.push(name);
          }
          currentElement = currentElement._currentElement._owner;
        }

        nativeEvent.__lrName = names;
      },
    },
  });
}
