import hub from 'react-dom/lib/EventPluginHub';

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
