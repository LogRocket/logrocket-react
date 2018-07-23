import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from 'react-dom';

const hub = __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.EventPluginHub;

export default function setupReact() {
  hub.injection.injectEventPluginsByName({
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
