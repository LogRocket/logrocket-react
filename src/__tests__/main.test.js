import setup from '../index';
import React, { Component, createRef, useCallback } from 'react';
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

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

function clickableDiv(props) {
  const ref = useCallback((element) => {
    if (element) element.click();
  });
  return <div {...props} ref={ref} />;
}

function makeFunctionComponent( name, displayName ) {
  // we can get the function to use the provided name by mounting it onto an
  // object first
  const mountedComponent = {
    [name](props) {
      return clickableDiv(props);
    },
  };
  const GeneratedComponent = mountedComponent[name];

  if (displayName) {
    GeneratedComponent.displayName = displayName;
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

const NestedA = () => <div><WithClickHandler /></div>;
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
const NestedD = () => <NestedE><NestedC /></NestedE>;
NestedD.displayName = 'NestedD';
NestedD.displayName = 'foobar';

const FunctionComponentWithoutDisplayName = makeFunctionComponent(
  'FunctionComponentWithoutDisplayName',
);

// specify both name and displayName here so that we can validate our
// preference for the latter
const FunctionComponentWithDisplayName = makeFunctionComponent(
  'FunctionComponentWithDisplayName', 'FCWithDisplayName'
);

describe('logrocket-react', () => {
  let clickEvents;

  beforeAll(() => {
    setup();

    document.addEventListener('click', e => {
      clickEvents.push(e);
    }, { capture: true, passive: true });
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
      'WithClickHandler', 'NestedA', 'NestedB', 'NestedC', 'NestedE', 'foobar',
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
      it('it reports the display name', function () {
        render(<FunctionComponentWithDisplayName />);
        expect(clickEvents).toHaveLength(1);
        expect(clickEvents[0].__lrName).toEqual(['FCWithDisplayName']);
      });
    });
  });
});
