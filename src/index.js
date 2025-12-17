export default function setupReact() {
  const listener = (event) => {
    try {
      let fiberNode;

      for (const key in event.target) {
        if (key.startsWith('__reactFiber')) {
          fiberNode = event.target[key];
          break;
        }
      }

      const names = [];
      let currentElement = fiberNode;
      while (currentElement) {
        var name =
          typeof currentElement.elementType === 'function' &&
          currentElement.elementType.displayName;
        if (name) {
          names.push(name);
        }
        currentElement = currentElement.return;
      }
      event.__lrName = names;
    } catch (err) {
      console.error(
        'logrocket-react caught an error while hooking into React. Please make sure you are using the correct version of logrocket-react for your version of react.'
      );
    }
  };

  document.body.addEventListener('click', listener, {
    capture: true,
    passive: true,
  });
}
