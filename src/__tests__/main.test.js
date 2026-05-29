import setup from '../index';
import { Component, createRef, useCallback } from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

function makeClassComponent({ addClickHandler, displayName }) {
  const onClick = addClickHandler ? () => {} : undefined;

  class GeneratedComponent extends Component {
    static displayName = displayName;
    constructor(props) {
      super(props);
      this.buttonRef = createRef();
    }

    componentDidMount() {
      this.buttonRef.current.click();
    }

    render() {
      return <div ref={this.buttonRef} onClick={onClick} />;
    }
  }

  return GeneratedComponent;
}
const WithClickHandler = makeClassComponent({
  addClickHandler: true,
  displayName: 'WithClickHandler',
});
const NoClickHandler = makeClassComponent({
  addClickHandler: false,
  displayName: 'NoClickHandler',
});

const NestedA = () => (
  <div>
    <WithClickHandler />
  </div>
);
NestedA.displayName = 'NestedA';
const NestedB = () => <NestedA />;
NestedB.displayName = 'NestedB';
const NestedC = () => (
  <div>
    <NestedB />
  </div>
);
NestedC.displayName = 'NestedC';
const NestedE = ({ children }) => <div>{children}</div>;
NestedE.displayName = 'NestedE';
const NestedD = () => (
  <NestedE>
    <NestedC />
  </NestedE>
);
NestedD.displayName = 'NestedD';
NestedD.displayName = 'foobar';

describe('logrocket-react', () => {
function FunctionComponentWithoutDisplayName(props) {
  const ref = useCallback((element) => {
    if (element) element.click();
  });
  return <div ref={ref} />;
}

function FunctionComponentWithDisplayName(props) {
  const ref = useCallback((element) => {
    if (element) element.click();
  });
  return <div ref={ref} />;
}

FunctionComponentWithDisplayName.displayName = 'FCWithDisplayName';

  let clickEvents;

  beforeAll(() => {
    setup();

    document.addEventListener(
      'click',
      (e) => {
        clickEvents.push(e);
      },
      { capture: true, passive: true }
    );
  });

  beforeEach(() => {
    clickEvents = [];
  });

  it('should log a click event with the component', () => {
    render(<WithClickHandler />);
    expect(clickEvents).toHaveLength(1);
    expect(clickEvents[0].__lrName).toEqual(['WithClickHandler']);
  });

  it('should log the full hierarchy of components', () => {
    render(<NestedD />);
    expect(clickEvents).toHaveLength(1);
    expect(clickEvents[0].__lrName).toEqual([
      'WithClickHandler',
      'NestedA',
      'NestedB',
      'NestedC',
      'NestedE',
      'foobar',
    ]);
  });

  it('should log when there is no click handler', () => {
    render(<NoClickHandler />);
    expect(clickEvents).toHaveLength(1);
    expect(clickEvents[0].__lrName).toEqual(['NoClickHandler']);
  });

  describe('given a function component', function () {
    describe('without a display name', function () {
      it('it reports the function name instead', function () {
        render(<FunctionComponentWithoutDisplayName />);
        expect(clickEvents).toHaveLength(1);
        expect(clickEvents[0].__lrName).toEqual([
          'FunctionComponentWithoutDisplayName',
        ]);
      });
    });
    describe('with a display name', function () {
      it('it reports the function name instead', function () {
        render(<FunctionComponentWithDisplayName />);
        expect(clickEvents).toHaveLength(1);
        expect(clickEvents[0].__lrName).toEqual(['FCWithDisplayName']);
      });
    });
  });
});
