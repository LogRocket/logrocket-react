import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from 'react-dom';


let getInstanceFromNode;
const secret = __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
if (secret && secret.Events && secret.Events[0]) {
  getInstanceFromNode = secret.Events[0];
} else {
  console.warn('logrocket-react does not work with this version of React');
}

export default function setupReact() {
  const listener = event => {
    try {
      const fiberNode = getInstanceFromNode(event.target)
      const names = [];
      let currentElement = fiberNode;
      while (currentElement) {
        var name = typeof currentElement.elementType === 'function' && currentElement.elementType.displayName;
        if (name) {
          names.push(name);
        }
        currentElement = currentElement.return;
      }
      event.__lrName = names;
      console.log(names);
    } catch (err) {
      console.error('logrocket-react caught an error while hooking into React. Please make sure you are using the correct version of logrocket-react for your version of react-dom.')
    }
  }

  document.body.addEventListener('click', listener, { capture: true, passive: true });
}
